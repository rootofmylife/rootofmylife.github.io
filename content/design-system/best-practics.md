# Best Practices

## Cookies

HTTP is stateless
Cookies are used to implement sessions (store authenticated user, shopping cart,...)
Browser and server send cookie back and forward

Prevent user to access cookie in browser

- In ExpressJS

```js
import crypto from "crypto";
import cookieParser from "cookie-parser";

const cookieSecret = "super-secret";

const app = createServer({ cookies: false, log: false });

app.use(cookieParser(cookieSecret));

const generateSessionId = () => {
  return crypto.randomBytes(16).toString("hex");
};

// ...

// Simulate user login and set a cookie

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password]
  );

  if (user) {
    const sessionId = generateSessionId();
    await db.run("INSERT INTO sessions (id, username) VALUES (?, ?)", [
      sessionId,
      username,
    ]);
    res.cookie("sessionId", sessionId, {
      httpOnly: true, // by using this, the hacker can not access cookie via console log, such as: document.cookie (prevent client side scripts from accessing cookies)
      secure: process.env.NODE_ENV === "production", // ensures cookies are sent over HTTPS only
      signed: true, // by using this, the hacker can not change the value of cookie in dev tool, and because the cookie is hashed so serve will check it every time the cookie is sent
    });
    res.redirect("/profile");
  } else {
    res.status(403).redirect("/login?error=Invalid login credentials.");
  }
});

app.post("/logout", (_, res) => {
  res.clearCookie("sessionId");
  res.redirect("/login");
});

// Display user profile only if the username cookie exists
app.get("/profile", async (req, res) => {
  res.locals.title = "Profile";
  // Access to signed cookie
  const sessionId = req.signedCookies.sessionId;
  if (!sessionId) {
    return res.redirect("/login?error=Please login to view your profile.");
  }
  const session = await db.get(
    "SELECT * FROM sessions WHERE id = ?",
    sessionId
  );

  const user = await db.get(
    "SELECT * FROM users WHERE username = ?",
    session.username
  );

  console.log(user, session);

  if (user && user.username) {
    res.send(
      (await readFile("./pages/profile.html", "utf-8")).replace(
        "{{username}}",
        user.username
      )
    );
  } else {
    return res.redirect("/login?error=Please login to view your profile.");
  }
});
```

## Same Origin Policy

A security measure implemented by web browsers to restrict how documents or scripts loaded from one origin interact with resources from other orgins.

==Two resources from different sites shouldn't be able to interfere with each other==

How to make sure we have `Same Origin Policy`? The formula is

$$
Protocol + Host + Port
$$

The browser checks three things: the protocol (e.g. `https://` vs `http://`), the domain (e.g. `fem.com`), and the port (e.g. 433).

If those three things are the same, then the browser considers the two resources to have the same origin.

There are some ways to build this:

- CORS
- JSONP (Json with padding)
- Proxies
- PostMessage API
- WebSockets
- `document.domain`

## Session Hijacking

### Privilege Escalation

A type of security exploit where an attacker gains elevated access to resources that are normally protected from an application or user.

So for `Session Hijacking`, using a cookie value in an attempt to try to trick the server into thinking that you're someone that you're not.

## Cross-Site Scripting: XSS

An injection attack where an attacker can execute malicious scripts in a web application.
Vulnerabilities are prevalant.
This occurs when an attacker sends malicious code, generally in the form of a browser-side script, to a different end user.
[[threat.txt]] in this folder. it's hidden by Obsidian

### Types

- Stored: Code that executes attacker's script is persisted in the server.
- Reflected: Transient response from server causes script to execute.
- DOM Based: No server interaction, script executes in the client. (i.e., pass code in via query string)
- Blind: Exploits vulnerability in another app (i.e, log-reader), that attacker can't see or access under normal circumstances.

### Locations for XSS Attacks

- User-generated rich text content (i.e., comments, forum posts).
- Embedded content (i.e., ads, widgets).
- Anywhere users have control over a URL
- Anywhere user input is reflected back to the user.
- Query parameters rendered into DOM
- `element.innerHTML` or `element.outerHTML`

### Some attacks

- Try to inject some scripts like `<script>alert('XSS')</script>` in the input fields.
- Injecting `<img src="..." onerror="alert('XSS')">` in the input fields.
- In the URL, try to inject some scripts like `http://example.com?search=<script>alert('XSS')</script>`.

### XSS defense

- Escape data before rendering it in the DOM.
  For example, `<script>alert('XSS')</script>` should be rendered as `&lt;script&gt;alert('XSS')&lt;/script&gt;`.
- Escape before putting user data in attribute
  For example, `<div class="user-data">` should be rendered as `<div class="&quot;user-data&quot;">`.
- Be particularly careful when 'templating' JS
- Avoid using functions that allow raw HTML input like `innerHTML` or `document.write`
- Safe Sink: a place where you can out data without the risk of it being vulnerable to XSS. These are places where the browser promises not to execute any code you give it

```js
element.textContent = randomInput; // The browser will not execute the code input

element.innerHTML = randomInput; // the browser sometimes executes the input if it's the code
```

Some DOME methods are considered safe sinks:

- `element.textContent`
- `element.insertAdjacentText`
- `element.className`
- `element.setAttribute`
- `element.value`
- `element.createTextNode`
- `element.createElement`

### XSS defense: Content Security Policy (CSP) headers

`Content-Security-Policy: script-src 'self'` - only allow scripts from the same domain.
`Content-Security-Policy: script-src 'self' https://apis.google.com` - allow scripts from the same domain and Google APIs.
Multiple directives can be separated by semicolon. For example, `Content-Security-Policy: script-src 'self' https://apis.google.com; style-src 'self' https://fonts.google.com`.
Selection of usefull CSP directives

- `child-src`- child execution context (frames, workers, etc.)
- `connect-src` - allowed URLs for XHR, WebSockets, etc.
- `default-src` - fallback for unspecified directives
- `form-action` - allowed URLs for form submissions
- `img-src, media-src, object-src` - allowed URLs for images, media, objects
- `style-src` - allowed URLs for stylesheets
- `upgrade-insecure-requests` - upgrade HTTP to HTTPS
  Some keywords for sources
- `'none'` - disallow
- `'self'` - same origin
- `'unsafe-inline'` - allow inline scripts or styles
- `'unsafe-eval'` - allow eval
- `data:` - allow data: URIs
  Request Security Headers:
- `sec-fetch-site`
  - `cross-site`: The request initiator and the server hosting the resource have a different origin and site
  - `same-site`: The request initiator have the same site, but this could be a different origin
  - `same-origin`: The request initiator and the server hosting the resource have the same origin
  - `none`: The user did this. They entered a URL into the address bar or opened a bookmark or dragged a file into the browser window.
- `sec-fetch-dest` - `empty` if they used fetch() - `image` if it's an image - `worker` if it was summoned by new `Worker()` - `document` for top-level navigations - `iframe` for iframe
  In node.js, use `helmet` package to set CSP headers.

```js
const helmet = require("helmet");
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: ["'self'", "'unsafe-inline'"],

      styleSrc: ["'self'", "'unsafe-inline'"],

      imgSrc: ["'self'", "data:"],

      connectSrc: ["'self'"],

      fontSrc: ["'self'", "data:"],

      objectSrc: ["'none'"],

      mediaSrc: ["'none'"],

      frameSrc: ["'none'"],

      frameAncestors: ["'none'"],

      formAction: ["'self'"],

      upgradeInsecureRequests: true,
    },
  })
);
```

You can use a `meta` tag in the head of your HTML document

```html
<meta
  http-equiv="Content-Security-Policy"
  content="script-src 'self' https://trusted.cdn.com"
/>
```

### Nonce

A token that we intend for one-time use.

```js
{
    default-src 'none'; // no sources are allowed
    script-src 'none-rAnd0m' 'strict-dynamic'; // scripts are only allowed if thay match the nonce in the HHTP response header, and scripts dynamically added by these scripts are trusted
    base-uri 'self'; // restricts the base element, which can prevent injected scripts from changing the locations that resources are loaded from.
    block-all-mixed-content; // prvent loading any resources via HTTP on an HTTPS page
}
```

Use in HTML

```html
<script nonce="rAnd0m"></script>

<style nonce="rAnd0m"></style>
```

Some notes:

- Need to regenerate your pages programmatically. This is easier if you're using server-generated pages
- Since the initial page has the nonce, you cannot cache the HTML

### XSS Attachment

- Use `Content-Disposition` header to force download.
- Use `X-Content-Type-Options: nosniff` to prevent MIME type sniffing.
  Note:
  Don't use `X-Content-Security-Policy` or `X-Webkit-CSP`

## Cross-site Request Forgery: CSRF

Takes advantage of the fact that cookies (or Basic Authentication credentials) are sent with every request.
For example: `<img src="http://example.com/transfer?from=victim-id&amount=1000&to=attacker-id">`.

- To be more specific, you need to be running attacker's code on a domain that can access that cookie.
  And if the server, when it receives a request is not looking at that cookie as the means of identifyingthe user, then this method of attack doesn't work any more.
- This attack works because I can write code on my site that will make a request to someone else's site. And although I can't read those cookies, I take advantage of the fact that the cookies are sent along for the ride.
  I actually can't see any communication between the user and that remote server, but I can basically trick them into mutating data into changing something.

### CSRF defense

- Use `SameSite` cookie attribute to prevent CSRF attacks.
  - `SameSite: Strict`: Only include the cookie if the request is sent from the same site that set the cookie
  - `SameSite: Lax`: Allows cookies to be sent with top-level navigations and if the request method is safe (e.g. `GET` or `HEAD` requests).
  - `Lax` versus `Strict`: `Lax` allows cookies to be sent with top-level navigations that are triggered by external sites (open a link from email or from another domain. If a user follows a link from an email or another site to a `SameSite=Strict` site where they are normally logged in, they would find themselves unexpectedly logged out. `SameSite=Lax` prevent this issue, providing a reasonable balance between preventing CSRF attacks and maintaining user session continuity across sites).
- Use `CSRF token` to prevent CSRF attacks. `localStorage` can be used to store CSRF token.
- Use `Origin` header to prevent CSRF attacks.
- In cases where there's no `Origin` header, use `Referer` header to prevent CSRF attacks.
- Don't use `GET` method with form, because `crsf` token can not encrypt the param in the URL

### CSRF token

This is a random value generated by the server. If a request is either missing or has an invalid token, then the server will reject the request.

Make sure that the value proposition of CSRF tokens is unpredictable. As soon as an attacker can guess the token, it's basically worthless

Do not include your CSRF tokens in `GET` method (???)

Here is what a malicious form might look like:

```html
<form action="http://localhost:4007/transfer" method="POST">
  <input type="hidden" name="amount" value="50" />

  <input type="submit" />
</form>
```

A CSRF attack tricks the victim's browser into sending a request to a vulnerable site, which performs an action on behalf of the user without their intention. This exploits the trust a site has in the browser of a user who is authenticated.

To fix it

Let's make a token when we make a session.

```js
import crypto, { randomUUID } from "crypto";

const sessionId = crypto.randomBytes(16).toString("hex");
const token = randomUUID();

await db.run(
  `INSERT INTO sessions (sessionId, userId, token) VALUES (?, ?, ?)`,
  [sessionId, user.id, token]
);

res.cookie("sessionId", sessionId);
```

We'll grab that token from their session.

```js
const { amount, recipient, _csrf } = req.body;

if (!_csrf || _csrf !== res.locals.token) {
  return res.status(403).send("Unauthorized");
}
```

We'll hide that token in the server generated form.

```html
<form action="http://localhost:4007/transfer" method="POST">
  <input type="hidden" name="amount" value="50" />

  <input type="submit" />

  <input type="hidden" name="_csrf" value="<%= token %>" />
</form>
```

### CSRF defense: Cross-Origin Resource Sharing (CORS)

This is what basically permits browsers to allow you to send a request from one domain to another, from one origin to another.
A preflight OPTIONS request gives server a chance to indicate what's allowed

Let's explain this story in steps:

1. So think of it as, if you're a web browser, you basically send a low overhead small request to the server saying I am planning on asking you for data in a moment.
2. I'm planning on passing these headers along when I ask you for data and I'm going to use this http verb `POST`. So that's this first section of headers here. And that request it has no body. It's just headers. It's like a head request.

   - For example - Preflight REQUEST to server:
     `Origin: http://example.com`
     `Access-Control-Request-Method: POST`
     `Access-Control-Request-Headers: Content-Type, Authorization`

3. When that response comes back, basically, the server would say, yes, I see you're coming from the following origin, `example.com`. And I allow not only the post request you're thinking about making but the following other types of requests. It absolutely fine to send me the authorization and the content type headers that you mentioned before. And, by the way, you don't have to ask me again for a while. You kind of, remember this and follow my instructions for the time being and just go ahead and make your requests.

   - For example - Preflight RESPONSE from server:
     `Access-Control-Allow-Origin: http://example.com`
     `Access-Control-Allow-Methods: POST, GET, OPTIONS`
     `Access-Control-Allow-Headers: Content-Type, Authorization`
     `Access-Control-Max-Age: 86400`

4. And then finally the browser can say, okay I've verified this. Now I'm gonna actually initiate the main request. All of this happens within the browser's internals.

   - For example - Main REQUEST to server:
     `Access-Control-Allow-Origin: http://example.com`
     `Access-Control-Allow-Methods: POST, GET, OPTIONS`
     `Access-Control-Allow-Headers: Content-Type, Authorization`
     `Authorization: Bear token`
     `Content-Type: application/json`
     In node.js, use `cors` package to set CORS headers.

   ```js
   const cors = require("cors");
   app.use(
     cors({
       origin: "http://example.com",
       methods: ["POST", "GET", "OPTIONS"],
       allowedHeaders: ["Content-Type", "Authorization"],
     })
   );
   ```

## Clickjacking

- An attack where an attacker tricks a user into clicking on a hidden element by disguising it as a legitimate element.
- The attacker can load the target site in an iframe and overlay it with a transparent element.
  For example

```html
<button onclick="transfer()">Click me</button>

<iframe src="http://example.com" style="opacity: 0.0;"></iframe>

<div
  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
></div>
```

### Defense

- Use `X-Frame-Options` header to prevent clickjacking.
  For example
  `X-Frame-Options: DENY` - prevent any site from framing the content, i.e., `iframe`.
  `X-Frame-Options: SAMEORIGIN` - allow framing from the same origin.
  `X-Frame-Options: ALLOW-FROM https://example.com` - allow framing from a specific domain.
  In node.js, use `helmet` package to set `X-Frame-Options` header.

```js
const helmet = require("helmet");

app.use(
  helmet.frameguard({
    action: "deny",
  })
);
```

In HTML

```html
<meta
  http-equiv="Content-Security-Policy"
  content="frame-ancestors 'self' https://trusteddomain.com.vn"
/>
```

Check JS in html

```js
if (window.self !== window.top) {
  window.top.location = window.self.location;
}
```

## Steps to Fix and Secure the Application

### Use Content Security Policy (CSP)

Add a response header to prevent your site from being embedded in an iframe.

```js
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self'");

  next();
});
```

### Use the X-Frame-Options Header

This HTTP header allows you to indicate whether your site can be embedded in a frame, iframe, or object.

```javascript
// Add security headers to prevent Clickjacking

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self'");

  res.setHeader("X-Frame-Options", "DENY");

  next();
});
```

### Break Out of Frames

In the event that you _never_ want your site in an `iframe`, you can use this simple client-side check in order to navigate to your site in the top-most frame if it's not currently the top-most frame. Words are hard, let's look at code.

```js
if (window.top != window.self) {
  if (window.top) {
    window.top.location.href = window.location.href;
  }
}
```

## Data Encryption

A data encryption vulnerability occurs when sensitive data is either not encrypted or is inadequately encrypted, leading to potential data exposure.

### Common pitfalls

Not encrypting: Sensitive information (like passwords, credit card numbers) is stored without encryption
Encrypting, but poorly: Using outdated or broken encryption algorithms that can be easily decrypted
Encrypting, but leaving the keys under the doormat: Poor handling of encryption keys, such as hardcoding keys in the code.
Encrypting, but too little and too late: Failing to encrypt data transmitted between the server and the client.

### Notes

Don't encrypt your passwords
=> Do hash and salting passwords

### Salting and Hashing Passwords

We're going to use [`bcrypt`](npm.im/bcrypt)

Upon registration, we're going to hash the password. We're going to use a randomly generated `salt` to further secure the password.

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

Now, we can't ever un-hash that password, but we _can_ take some user input, hash that input, and see if we get the same thing out the other end.

```js
bcrypt.compare(password, user.password);
```

## Json Web Token (JWT)

**Header**: contains metadata such as the type of token and the algorithm used for signing _HS256_
**Payload**: contains the actual claims or data
**Signature**: ensures that the token hasn't been tampered with

Let's assume we're using the [jsonwebtoken](npm.im/jsonwebtoken) library.

We can mint a JWT with any data we want.

```js
const secret = process.env.JWT_SECRET;

const token = jwt.sign({ username: user.username }, secret, {
  algorithm: "HS256",
});
```

And we can also decode it.

```js
const { username } = jwt.verify(token, secret);
```

But, we want to make sure we're specific about the algorithm that we want to use. Otherwise, someone can set us a token with the `none` algorithm.

```js
const { username } = jwt.verify(token, secret, { algorithms: ["HS256"] });
```

## JWT vs Session ID

### Storage of User Data

**JWT**: A JWT includes user data directly in the token. This data lists user ID, roles, permissions, and more. Importantly, it makes the server "stateless". Each request includes all the details needed to authenticate and authorize the user
**SID**: A session ID is a long, random string. It links to user data stored on the server. This data is ofter in memory or a database. When a request arrives, the server uses the session ID to find user info. This method, however, makes the server "stateful"

### Scalability

**JWT**: JWTs are more scalable. They don't require server-side session storage. This makes them perfect for distributed systems.
In these setups, users work with many servers in a cloud. By skipping session storage, servers save resources. This also simplifies load balancing
**SID**: Scaling is harder with SID. Every server that could serve a user's request must access their session data.
This often means using shared storage or replicating sessions. These methods can complicate load balancing and increase overhead

### Security Considerations

**JWT**: JWTs can be stolen if stored insecurely. They can saved in browsers, making them targets for XSS attacks. Once issued, their information is fixed until they expire.
You can instantly revoke them by using a denylist.
**SID**: SID is more secure because data is stored on the server. However, they are susceptible to session hijacking if the session ID is intercepted by an attacker (using `Secure` + `HttpOnly` cookies can mitigate this risk).

### Statelessness and Statefullness

**JWT**: JWTs create a stateless setup. Each request carries its needed information, aligning with RESTful API principles.
**SID**: SID needs the server to keep track of states. This can complicate matters, but it offers precise control over session data.They might be more bandwidth-efficient. Only a small ID is sent with each request.

### Expiration Management

**JWT**: JWT controls its own expiration. It's valid until it expires. However, checks are needed to revoke it.
**SID**: Server manages SID's expiration.

### JWT Storage

Local Storage:

- Easy access: Token can be easily accessed from JS running in the browser, making it straightforward to manage tokens in client-side applications.
- Persistence: Data stored in local storage persists even after the browser window is closed, facilitating persistent user sessions.
- Vulnerable to XSS: If an attacker can execute JS on the application, they can retrieve the JWTs stored in local storage.
- No HttpOnly: Local storage does not support `HttpOnly` cookies, which means all stored data is accessible through client-side scripts.
  Session Storage:
- Tab specific: Data is accessible only within the tab that created it, which provides some level of isolation.
- Ease of use: Similar to local storage, session storage is easy to use and integrates well with client-side scripts.
- Limited lifetime: Data in session storage is cleared when the tab or window is closed, which could be inconvenient for users who expect longer session times.
- Vulnerable to XSS.
  Cookies:
- HttpOnly: Cookies can be configured as `HttpOnly`, making them inaccessible to JS and thus protecting them from being stolen through XSS attacks
- Secure: Can be configured to be transmitted only over secure channels (HTTPS)
- Domain and path scoping: Provides additional security settings, such as trstricting the cookies to certain domains or paths.
- CSRF vulnerability: unless properly configured with attributes like `SameSite`, cookies can be susceptible to CSRF attacks.
- Size limitations: Cookies are limited in size (around 4KB) and each HTTP request includes cookies, which could potentially increase the load times if not managed correctly.

## JWT Best Practices

Use `HttpOnly` cookies for JWTs

- Include HttpOnly and Secure: Store JWT in cookies with these attributes. This limits JS access and ensures HTTPS-only transmission.
- Add SameSite: Set the attribute to Strict or Lax to reduce CSRF risks.
  Use short-lived JWT and refresh tokens
- Limit JWT lifespan: Set JWTs to expire in 15 minutes to an hour. This reduces risk if a token is stolen.
- Refresh tokens: Keep sessions active with refresh tokens. Store them securely and use them to issue new access tokens.
  Control your token usage
- Avoid sensitive info: Don't store sensitive data in JWTs. They are easily decoded.
- Define scope and audience: Clearly limit token usage to reduce risks.

## Directory Traversal

Directory traversal (also known as path traversal) is a type of vulnerability that allows attackers to gain unauthorized access to files on the server by manipulating the path to files, commonly through URL parameters.

For example, if the URL parameter `filename` can be manipulated to `../../etc/passwd` (or any other critical path), the attacker might be able to access sensitive files on the server:

```http

http://localhost:3000/files/../../etc/passwd

```

## Fixing the Vulnerability

### Step 1: Validate Input

Validate and sanitize the input to ensure it's free from malicious characters like `..`.

### Step 2: Use a Allowlist

Ensure that only allowed filenames from a Allowlist are served.

### Step 3: Employ Path Normalization

Normalize the path and ensure it's within the intended directory.

### Step-by-Step Code Fix

**Step 1: Install `sanitizer`**

```sh

npm install sanitize-filename

```

**Step 2: Update `index.js` to include input validation and sanitization**

```javascript
app.get("/files", (req, res) => {
  const rawFilename = String(req.query.file);

  const fileName = sanitize(rawFilename);

  if (fileName) {
    res.sendFile(fileName, { root: fileDirectory }, (err) => {
      if (err) {
        res.status(404).send("File not found");
      }
    });
  } else {
    res.status(400).send("File name not provided");
  }
});
```

## File Upload

### Step to Fix and Secure the Application

1. **Restrict File Types**: Use file type validation to ensure only trusted file types can be uploaded.

2. **Sanitize Filenames**: Sanitize user input to remove any malicious content in file names.

3. **Use Unique Paths**: Use unique and unpredictable paths to store uploaded files.

4. **Access Control**: Ensure proper access control is in place to prevent unauthorized access to uploaded files.

### Fixing the Application

Modify `index.js` to include file validation and sanitization:

```javascript
import express from "express";

import multer from "multer";

import path from "path";

import fs from "fs";

import { fileTypeFromFile } from "file-type";

// Configuring multer for file upload

const upload = multer({
  dest: "uploads/",

  limits: { fileSize: 5 * 1024 * 1024 }, // limiting files to 5MB

  fileFilter: async (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
    try {
      const fileType = await fileTypeFromFile(file.path);
      if (fileType && allowedMimeTypes.includes(fileType.mime)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            `Unsupported file type: ${fileType ? fileType.mime : "unknown"}`
          ),
          false
        );
      }
    } catch (error) {
      cb(new Error("Invalid file"), false);
    }
  },
});

app.post("/files", upload.single("file"), async (req, res) => {
  try {
    const { originalname, filename, path } = req.file;

    const sanitizedFilename = path
      .basename(originalname)
      .replace(/[^a-z0-9\.-]/gi, "_");

    const newFullPath = `uploads/${sanitizedFilename}`;

    fs.renameSync(`uploads/${filename}`, newFullPath);
    await db.run("INSERT INTO uploads (filename) VALUES (?)", [
      sanitizedFilename,
    ]);

    res.send(
      `File uploaded: <a href="${sanitizedFilename}">${sanitizedFilename}</a>`
    );
  } catch (error) {
    res.status(500).send("An error occurred while uploading the file.");
  }
});
```

## Detailed Steps for Remediation

1. Multer Configuration:

   - **Limit File Size**: Set a maximum file size to reduce the risk of Denial of Service.
   - **File Filter**: Filter out files that are not in the allowed MIME types list (`image/jpeg`, `image/png`, `application/pdf`).

2. Sanitize Filenames:

   - Replace any character that is not alphanumeric or a dot/underscore with an underscore (`_`).
   - Avoid using the original filename directly.

3. Validate File Type Using FileType:

   - Use the `fileTypeFromFile` function from the `file-type` package to determine the actual MIME type of the uploaded file.
   - Compare the detected MIME type against the allowed list and reject any disallowed types.
