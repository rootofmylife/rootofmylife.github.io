# Networking

## Protocols

- HTTPS, HTTPS, SMTP, IMAP, IRC, FTP, SSH, SSL,...

By default, systems can only listen to ports below 1024 as the root user:

```bash
>>> nc -lp 1024
```

```bash
>>> nc -lp 1023
Can't grab 0.0.0.0:1023 with bind: Permission denied
```

## Netcat server and client

Open one of the terminal and run the server:

```bash
>>> nc -l 1024
```

Open another terminal and run the client:

```bash
>>> nc localhost 1024
```

Then, you can type in the client terminal and see the message in the server terminal or vice versa.

## HTTP GET request

Type in the client terminal (all text line by line):

```bash
>>> nc google.com 80
GET / HTTP/1.1
Host: google.com
```

Make sure to hit enter twice to send the message.

## HTTP POST request

Form a POST request:

```bash
>>> nc localhost 80
POST /form HTTP/1.1
Host: localhost
Content-Length: 51
Content-Type: application/x-www-form-urlencoded

title=Hello&body=World
```

Here is the simple NodeJS server:

```js
var http = require("http");
var parseform = require("body/any");

var server = http.createServer(function (req, res) {
  console.log(req.method, req.url, req.headers);
  parseform(req, res, function (err, params) {
    res.end(JSON.stringify(params));
  });
});

server.listen(80);
```

Then, run NodeJS server

```bash
>>> node server.js
```

## Curl

To connect a website:

```bash
curl -s google.com
```

To get the headers:

```bash
curl -sI google.com
```

The `-s` flag is to silent the output.

### To send a method

Use `-X` flag an `-d` flag to send data:

```bash
curl -X POST http://localhost:5134 -d title=Hello -d body='World with space'
```

### To send a header

```bash
curl -X POST http://localhost:5134 -d title=Hello -d body='World with space' -H 'Content-Type: application/x-www-form-urlencoded'
```

## SMTP

SMTP is a protocol to send email. Here is an example of sending email using `nc`:

```bash
nc smtp.gmail.com 587
```

Or to work on localhost

```bash
nc localhost 25
```

Then, type the following:

```bash
mail from: someone@mymail.com

rcpt to: toyou@aaaa.com

data

Subject: Hello

Hello, this is a test email.
.
```

Type `quit` to exit.

Then open `mail` command to check the email:

```bash
>>> mail
```

## IRC

IRC is an text-based chat protocol. Here is an example of connecting to an IRC server:

```bash
nc irc.freenode.net 6667
```

Then, type the following:

```bash
nick wowy-karik
user wowy-karik wowy-karik irc.freenode.net :wowy-karik
join #javascript
```

Then send a message:

```bash
privmsg #javascript :Hello, world!
```

To quit:

```bash
quit
```
