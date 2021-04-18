LoadLibrary("sqlite");

function msg(s) {
	Debugln(s);
	Println(s);
}

function dump(s) {
	msg(JSON.stringify(s));
}

function exec(sql, stmt) {
	try {
		msg(stmt);
		var res = sql.Exec(stmt);
		dump(res);
	} catch (e) {
		msg(e);
	}
}

RmFile("test.db");

var sql = new SQLite("test.db");
//////
// create test table
exec(sql, "CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT);");

// insert two lines
exec(sql, "INSERT INTO test (id, name) VALUES (42, 'zweiundvierzig');");
exec(sql, "INSERT INTO test (id, name) VALUES (23, 'dreiundzwanzig');");

// try duplicate check
exec(sql, "INSERT INTO test (id, name) VALUES (23, 'dreiundzwanzig');");

// select some data
exec(sql, "SELECT * from test;");
exec(sql, "SELECT * from test WHERE id=23;");

// drop table again
//exec(sql, "DROP TABLE test;");


//////
// create, fill and drop a table
exec(sql, "CREATE TABLE t1 (a PRIMARY KEY, b TEXT, c REAL);");

exec(sql, "BEGIN TRANSACTION;");
for (var i = 0; i < 1000; i++) {
	exec(sql, "INSERT INTO t1 (a, b, c) VALUES (" + i + ", '" + i + "', " + (i / 3) + ");");
}
exec(sql, "COMMIT;");

exec(sql, "CREATE INDEX ON t1 (b);");

exec(sql, "UPDATE t1 set b='foo' where a=666;");
exec(sql, "UPDATE t1 set b='bar' where a BETWEEN 23 AND 42;");

exec(sql, "BEGIN TRANSACTION;");
exec(sql, "DELETE FROM t1;");
exec(sql, "ROLLBACK;");

exec(sql, "SELECT * from t1 WHERE b='foo' OR b='bar';");

//exec(sql, "DROP TABLE t1;");

sql.Close();
