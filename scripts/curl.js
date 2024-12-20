LoadLibrary("curl");

function sslTest(url) {
	Println("+++ Trying " + url)

	var https = new Curl();
	var resp = https.DoRequest(url);
	assert("HTTPS test", resp[2], 200);
	Println(resp[1].ToString());

	Println("+++ DONE " + url)
}

function assert(txt, ist, soll) {
	if (ist != soll) {
		throw txt + ": result was '" + ist + "' but should be '" + soll + "'";
	}
}

Println(">>> date=" + new Date().toISOString());

Println("Resolve()              = " + JSON.stringify(Resolve("curl.se")));

// simple https get
sslTest("https://curl.se");
sslTest("https://mastodon.social/about");
sslTest("https://retrochat.online/about");
sslTest("https://bitbang.social/about");
sslTest("https://raw.githubusercontent.com/SuperIlu/DOjSHPackages/master/dojs/index.json");
sslTest("https://www.shdon.com/");
sslTest("https://www.heise.de");

// try https post
var post = new Curl();
post.SetPost();
post.AddPostData('FOO', 'BAR');
var resp = post.DoRequest("https://curl.se");
assert("HTTPS test", resp[2], 200);
Println(resp[1].ToString());
