/*
MIT License

Copyright (c) 2019-2021 Andre Seidelt <superilu@yahoo.com>

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
//////
// test generic functions
//Println(JSON.stringify(WattIpDebug([1, 2, 3, 4])));
Println("GetLocalIpAddress() = " + JSON.stringify(GetLocalIpAddress()));
Println("GetNetworkMask()    = " + JSON.stringify(GetNetworkMask()));
Println("GetDomainname()     = " + JSON.stringify(GetDomainname()));
Println("GetHostname()       = " + JSON.stringify(GetHostname()));
Println("Resolve()           = " + JSON.stringify(Resolve("www.heise.de")));
Println("ResolveIp()         = " + JSON.stringify(ResolveIp([193, 99, 144, 80])));

//////
// test UDP socket send
udp = UdpSocket([192, 168, 2, 8], 20001);
udp.WriteString("WattTest 123");
udp.WaitFlush();
udp.WaitInput();
str = udp.ReadLine();
Println("UDP = " + str);
udp.Close();

//////
// test tcp socket send/receive
s = Socket([192, 168, 2, 8], 65432);
Println("ESTABLISHED         = " + s.Established());
s.Mode(SOCKET.ASCII);
s.WriteByte(32);
s.Flush();
s.WaitFlush();
Println("DataReady ch        = " + s.DataReady());
sp = s.ReadByte();
Println("SPACE               = " + sp);

s.WriteString("This is a test of the emergency broadcast system!\r\n");
s.WaitFlush();
s.WaitInput();
Println("DataReady str       = " + s.DataReady());
str = s.ReadLine();
Println("STRING              = " + str);

Println("local port          = " + s.GetLocalPort());
Println("remote port         = " + s.GetRemotePort());
Println("remote host         = " + JSON.stringify(s.GetRemoteHost()));

s.Close();

//////
// HTTP test
var http = http_get("http://192.168.2.8/index.html");
Println(JSON.stringify(http));
Println(http_string_content(http));
Println(JSON.stringify(http_headers(http)));


//////
// server socket
var count = 0;
var ssocket = ServerSocket(SOCKET.SERVER.ANY, 4711);
while (!ssocket.Established()) {
	Println("No connection yet:" + count);
	Sleep(1000);
	count++;
	if (count > 20) {
		break;
	}
}
Println("Connection from " + JSON.stringify(ssocket.GetRemoteHost()) + ":" + ssocket.GetRemotePort());
while (ssocket.Established() || ssocket.DataReady()) {
	var ready = ssocket.DataReady();
	var line = ssocket.ReadLine();

	if (line) {
		Println("[" + ready + "] " + line);
		break;
	} else {
		Sleep(1000);
	}
}
ssocket.Close();

Println("Exiting");