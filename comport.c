/*
MIT License

Copyright (c) 2019 Andre Seidelt <superilu@yahoo.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
#include <duktape.h>
#include <errno.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <dzcomm.h>
#include "comport.h"
#include "jSH.h"

/************
** defines **
************/
#define COM_NUM_PORTS 8       //!< max number of ports
#define COM_PORT "PORT"       //!< field name for 'port number'
#define COM_BUFFER_SIZE 4096  //!< max line length in Com_ReadBuffer()

/*********************
** static variables **
*********************/
static bool com_used[COM_NUM_PORTS];  //!< keep track of opened ports

/*********************
** static functions **
*********************/
/**
 * @brief finalize a file and free resources.
 *
 * @param J VM state.
 */
static duk_ret_t Com_Finalize(duk_context *J) {
    // get pointer and port number
    duk_get_prop_string(J, -1, DUK_HIDDEN_SYMBOL(TAG_COM));
    comm_port *port = duk_get_pointer(J, -1);
    duk_get_prop_string(J, -1, DUK_HIDDEN_SYMBOL(COM_PORT));
    int com = duk_get_int(J, -1);

    DEBUGF("fin COM%d=%p\n", com + 1, port);

    if (port) {
        comm_port_uninstall(port);
        comm_port_delete(port);
    }
    com_used[com] = false;

    return 0;
}

/**
 * @brief open a com port.
 * new COMPort(port:number, baud:number, bits:number, parity:number, stop:number, flow:number[, addr:number, irq:number])
 *
 * @param J VM state.
 */
static duk_ret_t new_Com(duk_context *J) {
    if (!duk_is_constructor_call(J)) {
        return DUK_RET_TYPE_ERROR;
    }

    int com = duk_require_int(J, 0);
    if (com < _com1 || com > _com4) {
        return duk_generic_error(J, "COM parameter must be one of COM.PORT.COMx!");
    } else if (com_used[com]) {
        return duk_generic_error(J, "COM port already opened!");
    }
    com_used[com] = true;
    comm_port *port = comm_port_init(com);
    if (!port) {
        return duk_generic_error(J, "COM error: %s!", szDZCommErr);
    }

    int baud = duk_require_int(J, 1);
    if (baud < _75 || baud > _115200) {
        return duk_generic_error(J, "Baud rate must be one of COM.BAUD.Bx!");
    }
    comm_port_set_baud_rate(port, baud);

    int bits = duk_require_int(J, 2);
    if (bits < BITS_5 || bits > BITS_8) {
        return duk_generic_error(J, "Word length must be one of COM.BIT.BITS_x!");
    }
    comm_port_set_data_bits(port, bits);

    int par = duk_require_int(J, 3);
    if (par < NO_PARITY || par > SPACE_PARITY) {
        return duk_generic_error(J, "Word length must be one of COM.PARITY.x_PARITY!");
    }
    comm_port_set_parity(port, par);

    int stop = duk_require_int(J, 4);
    if (stop != STOP_1 && stop != STOP_2) {
        return duk_generic_error(J, "Stop bits must be one of COM.STOP.STOP_x!");
    }
    comm_port_set_stop_bits(port, stop);

    int flow = duk_require_int(J, 5);
    if (flow < NO_CONTROL || flow > RTS_CTS) {
        return duk_generic_error(J, "Flow control must be one of COM.FLOW.x!");
    }
    comm_port_set_flow_control(port, flow);

    if (duk_is_number(J, 6) && duk_is_number(J, 7)) {
        int addr = duk_get_int(J, 6);
        int irq = duk_get_int(J, 7);
        comm_port_set_port_address(port, addr);
        if (irq < 0 || irq > 15) {
            return duk_generic_error(J, "Irq must be between 0..15!");
        }
        comm_port_set_irq_num(port, irq);
    }

    DEBUGF("Opening COM%d with irq=%d and port=0x%X as %p\n", com + 1, comm_port_get_irq_num(port), comm_port_get_port_address(port), port);

    if (!comm_port_install_handler(port)) {
        return duk_generic_error(J, "COM error: %s!", szDZCommErr);
    }

    // Get access to the default instance.
    duk_push_this(J);  // -> stack: [ name this ]

    duk_push_int(J, com);
    duk_put_prop_string(J, -2, DUK_HIDDEN_SYMBOL(COM_PORT));  // store port number

    duk_push_pointer(J, port);
    duk_put_prop_string(J, -2, DUK_HIDDEN_SYMBOL(TAG_COM));  // store port pointer

    duk_push_c_function(J, Com_Finalize, 1);  // set finalized
    duk_set_finalizer(J, -2);

    /* Return undefined: default instance will be used. */
    return 0;
}

/**
 * @brief close port.
 * com.Close()
 *
 * @param J VM state.
 */
static duk_ret_t Com_Close(duk_context *J) {
    // get pointer and port number
    duk_push_this(J);
    duk_get_prop_string(J, -1, DUK_HIDDEN_SYMBOL(TAG_COM));
    comm_port *port = duk_get_pointer(J, -1);
    duk_get_prop_string(J, -1, DUK_HIDDEN_SYMBOL(COM_PORT));
    int com = duk_get_int(J, -1);
    duk_pop(J);

    DEBUGF("close COM%d=%p\n", com + 1, port);

    // close and delete port if still open, mark port as free again
    if (port) {
        comm_port_uninstall(port);
        comm_port_delete(port);
    } else {
        return duk_generic_error(J, "Port is already closed!");
    }
    com_used[com] = false;

    // set port property to NULL
    duk_push_this(J);
    duk_push_pointer(J, NULL);
    duk_put_prop_string(J, -2, DUK_HIDDEN_SYMBOL(TAG_COM));
    duk_pop(J);

    return 0;
}

/**
 * @brief flush.
 * com.FlushInput()
 *
 * @param J VM state.
 */
static duk_ret_t Com_FlushInput(duk_context *J) {
    comm_port *port;
    NATIVE_PTR(J, port, TAG_COM);

    if (port) {
        comm_port_flush_input(port);
    } else {
        return duk_generic_error(J, "Port is closed!");
    }

    return 0;
}

/**
 * @brief flush.
 * com.FlushOutput()
 *
 * @param J VM state.
 */
static duk_ret_t Com_FlushOutput(duk_context *J) {
    comm_port *port;
    NATIVE_PTR(J, port, TAG_COM);

    if (port) {
        comm_port_flush_output(port);
    } else {
        return duk_generic_error(J, "Port is closed!");
    }

    return 0;
}

/**
 * @brief com.IsOutputEmpty():boolean
 *
 * @param J VM state.
 */
static duk_ret_t Com_IsOutputEmpty(duk_context *J) {
    comm_port *port;
    NATIVE_PTR(J, port, TAG_COM);

    if (port) {
        duk_push_boolean(J, comm_port_out_empty(port) == -1);
        return 1;
    } else {
        return duk_generic_error(J, "Port is closed!");
    }
}

/**
 * @brief com.IsOutputFull():boolean
 *
 * @param J VM state.
 */
static duk_ret_t Com_IsOutputFull(duk_context *J) {
    comm_port *port;
    NATIVE_PTR(J, port, TAG_COM);

    if (port) {
        duk_push_boolean(J, comm_port_out_full(port) == -1);
        return 1;
    } else {
        return duk_generic_error(J, "Port is closed!");
    }
}

/**
 * @brief com.WriteChar(string)
 *
 * @param J VM state.
 */
static duk_ret_t Com_WriteChar(duk_context *J) {
    comm_port *port;
    NATIVE_PTR(J, port, TAG_COM);

    if (port) {
        duk_size_t len;
        const char *str = duk_require_lstring(J, 0, &len);

        if (len >= 0) {
            int ret = comm_port_out(port, str[0]);
            if (ret != 1) {
                return duk_generic_error(J, "TX buffer overflow!");
            }
        }
        return 0;
    } else {
        return duk_generic_error(J, "Port is closed!");
    }
}

/**
 * @brief com.Write(string):number
 *
 * @param J VM state.
 */
static duk_ret_t Com_Write(duk_context *J) {
    comm_port *port;
    NATIVE_PTR(J, port, TAG_COM);

    if (port) {
        const char *str = duk_require_string(J, 0);

        duk_push_int(J, comm_port_string_send(port, str));
        return 1;
    } else {
        return duk_generic_error(J, "Port is closed!");
    }
}

/**
 * @brief com.IsInputEmpty():boolean
 *
 * @param J VM state.
 */
static duk_ret_t Com_IsInputEmpty(duk_context *J) {
    comm_port *port;
    NATIVE_PTR(J, port, TAG_COM);

    if (port) {
        duk_push_boolean(J, comm_port_in_empty(port) == -1);
        return 1;
    } else {
        return duk_generic_error(J, "Port is closed!");
    }
}

/**
 * @brief com.IsInputFull():boolean
 *
 * @param J VM state.
 */
static duk_ret_t Com_IsInputFull(duk_context *J) {
    comm_port *port;
    NATIVE_PTR(J, port, TAG_COM);

    if (port) {
        duk_push_boolean(J, comm_port_in_full(port) == -1);
        return 1;
    } else {
        return duk_generic_error(J, "Port is closed!");
    }
}

/**
 * @brief com.ReadChar():number
 *
 * @param J VM state.
 */
static duk_ret_t Com_ReadChar(duk_context *J) {
    comm_port *port;
    NATIVE_PTR(J, port, TAG_COM);

    if (port) {
        int ret = comm_port_test(port);
        DEBUGF("RC 0x%02X\n", ret);
        if (ret < 0) {
            duk_push_null(J);
        } else {
            duk_push_int(J, ((int)ret) & 0xFF);
        }
        return 1;
    } else {
        return duk_generic_error(J, "Port is closed!");
    }
}

/**
 * @brief com.ReadBuffer():string
 *
 * @param J VM state.
 */
static duk_ret_t Com_ReadBuffer(duk_context *J) {
    comm_port *port;
    NATIVE_PTR(J, port, TAG_COM);

    if (port) {
        int pos = 0;
        char buf[COM_BUFFER_SIZE];

        while (pos < COM_BUFFER_SIZE) {
            int ret = comm_port_test(port);
            DEBUGF("RB %0x02X\n", ret);
            if (ret < 0) {
                break;
            } else {
                buf[pos] = ((int)ret) & 0xFF;
                pos++;
            }
        }
        duk_push_lstring(J, buf, pos);
        return 1;

    } else {
        return duk_generic_error(J, "Port is closed!");
    }
}

/***********************
** exported functions **
***********************/
#define COM_PUSH_BAUD(b, o)                \
    {                                      \
        duk_push_int(J, _##b);             \
        duk_put_prop_string(J, o, "B" #b); \
    }

#define COM_PUSH_VALUE(n, o)           \
    {                                  \
        duk_push_int(J, n);            \
        duk_put_prop_string(J, o, #n); \
    }

#define COM_PUSH_VALUE_NAME(n, v, o)  \
    {                                 \
        duk_push_int(J, v);           \
        duk_put_prop_string(J, o, n); \
    }

/**
 * @brief initialize file subsystem.
 *
 * @param J VM state.
 */
void init_comport(duk_context *J) {
    // mark all ports as unused
    for (int i = 0; i < COM_NUM_PORTS; i++) {
        com_used[i] = false;
    }

    dzcomm_init();  // initialize DZComm

    // push the enums into COM object in 'global'
    duk_idx_t com = duk_push_object(J);
    {
        {
            duk_idx_t baud = duk_push_object(J);
            COM_PUSH_BAUD(50, baud);
            COM_PUSH_BAUD(75, baud);
            COM_PUSH_BAUD(110, baud);
            COM_PUSH_BAUD(134, baud);
            COM_PUSH_BAUD(150, baud);
            COM_PUSH_BAUD(200, baud);
            COM_PUSH_BAUD(300, baud);
            COM_PUSH_BAUD(600, baud);
            COM_PUSH_BAUD(1200, baud);
            COM_PUSH_BAUD(1800, baud);
            COM_PUSH_BAUD(2400, baud);
            COM_PUSH_BAUD(4800, baud);
            COM_PUSH_BAUD(9600, baud);
            COM_PUSH_BAUD(19200, baud);
            COM_PUSH_BAUD(38400, baud);
            COM_PUSH_BAUD(57600, baud);
            COM_PUSH_BAUD(115200, baud);
            duk_put_prop_string(J, com, "BAUD");
        }

        {
            duk_idx_t par = duk_push_object(J);
            COM_PUSH_VALUE(NO_PARITY, par);
            COM_PUSH_VALUE(ODD_PARITY, par);
            COM_PUSH_VALUE(EVEN_PARITY, par);
            COM_PUSH_VALUE(MARK_PARITY, par);
            COM_PUSH_VALUE(SPACE_PARITY, par);
            duk_put_prop_string(J, com, "PARITY");
        }

        {
            duk_idx_t stop = duk_push_object(J);
            COM_PUSH_VALUE(STOP_1, stop);
            COM_PUSH_VALUE(STOP_2, stop);
            duk_put_prop_string(J, com, "STOP");
        }

        {
            duk_idx_t flow = duk_push_object(J);
            COM_PUSH_VALUE(NO_CONTROL, flow);
            COM_PUSH_VALUE(XON_XOFF, flow);
            COM_PUSH_VALUE(RTS_CTS, flow);
            duk_put_prop_string(J, com, "FLOW");
        }

        {
            duk_idx_t bits = duk_push_object(J);
            COM_PUSH_VALUE(BITS_5, bits);
            COM_PUSH_VALUE(BITS_6, bits);
            COM_PUSH_VALUE(BITS_7, bits);
            COM_PUSH_VALUE(BITS_8, bits);
            duk_put_prop_string(J, com, "BIT");
        }

        {
            duk_idx_t port = duk_push_object(J);
            COM_PUSH_VALUE_NAME("COM1", _com1, port);
            COM_PUSH_VALUE_NAME("COM2", _com2, port);
            COM_PUSH_VALUE_NAME("COM3", _com3, port);
            COM_PUSH_VALUE_NAME("COM4", _com4, port);
            duk_put_prop_string(J, com, "PORT");
        }
    }
    duk_put_global_string(J, "COM");

    // Push constructor function
    duk_push_c_function(J, new_Com, 8);

    // Push MyObject.prototype object.
    duk_push_object(J);  // -> stack: [ MyObject proto ]

    // Set MyObject.prototype.funcs()
    PROTDEF(J, Com_Close, "Close", 0);
    PROTDEF(J, Com_FlushInput, "FlushInput", 0);
    PROTDEF(J, Com_FlushOutput, "FlushOutput", 0);
    PROTDEF(J, Com_IsOutputEmpty, "IsOutputEmpty", 0);
    PROTDEF(J, Com_IsOutputFull, "IsOutputFull", 0);
    PROTDEF(J, Com_WriteChar, "WriteChar", 1);
    PROTDEF(J, Com_Write, "Write", 1);
    PROTDEF(J, Com_IsInputEmpty, "IsInputEmpty", 0);
    PROTDEF(J, Com_IsInputFull, "IsInputFull", 0);
    PROTDEF(J, Com_ReadChar, "ReadChar", 0);
    PROTDEF(J, Com_ReadBuffer, "ReadBuffer", 0);

    // Set MyObject.prototype = proto
    duk_put_prop_string(J, -2, "prototype");  // -> stack: [ MyObject ]

    // Finally, register MyObject to the global object
    duk_put_global_string(J, "COMPort");  // -> stack: [ ]
}

/**
 * @brief shutdown DZComm.
 */
void shutdown_comport() { dzcomm_closedown(); }
