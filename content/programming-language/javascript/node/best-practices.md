# Node Best Practices

## Structure your solution by components

For medium sized apps and above, *non-modular* monoliths are really bad - having one big software with 'spaghetti' of dependencies is just hard to reason about. The ultimate solution is to develop smaller software: divide the whole stack into self-contained components that don't share files with others, each is a standalone logical app (e.g. has its own API, service, data access, test, etc.) so that onboarding into it and changing the code is much easier than dealing with the whole system.
Some may call this 'microservices' architecture.

```bash
my-system
├─ apps (components)
│  ├─ orders
│  │ ├─ package.json
│  │ ├─ api
│  ├─ entry-points
│  │  ├─ api # controller comes here
│  │  ├─ message-queue # message consumer comes here
│  │ ├─ domain
│  │ ├─ data-access
│  ├─ users
│  ├─ payments
├─ libraries (generic cross-component functionality)
│  ├─ logger
│  ├─ authenticator
```

The root of every component should hold 3 folders that represent common concerns and stages of every transaction:

- **Entry-points** This is where requests and flows start, whether it's REST API, Graph, message queue, scheduled jobs or any other *door* to the application. This layer's responsibility is quite minimal - adapt the payload (e.g., JSON) to the app format, including first validation, call the logic/domain layer and return a response. This is typically achieved with a few lines of code. Many use the term "controller" for this type of code also technically, its just an adapter
- **Domain** This is where the app flows, logic and data live. This layer accepts protocol-agnostic payload, plain JavaScript object and returns one as well. Technically it contains common code objects like services, dto/entities, and clients that call external services. It also typically calls the data-access layer to retrieve or persist information
- **Data-access** This is where the app holds code that interacts with DB. Ideally, it should externalize an interface that returns/gets plain JavaScript object that is DB agnostic (also known as the repository-pattern). This layer involves DB helper utilities like query builders, ORMs, DB drivers and other implementation libraries
- [x] Read here: [Link](https://martinfowler.com/articles/microservices.html)

## Use Async-Await or promises for async error handling

Handling async errors in callback style is probably the fastest way to hell (a.k.a the pyramid of doom). The best gift you can give to your code is using Promises with async-await which enables a much more compact and familiar code syntax like try-catch
Using promises to catch errors

```js
return functionA()
  .then(functionB)
  .then(functionC)
  .then(functionD)
  .catch((err) => logger.error(err))
  .then(alwaysExecuteThisFunction);
```

Using async/await to catch errors

```js
async function executeAsyncTask() {
  try {
    const valueA = await functionA();
    const valueB = await functionB(valueA);
    const valueC = await functionC(valueB);
    return await functionD(valueC);
  } catch (err) {
    logger.error(err);
  } finally {
    await alwaysExecuteThisFunction();
  }
}
```

## Use only the built-in Error object

Some libraries throw errors as a string or as some custom type – this complicates the error handling logic and the interoperability between modules. Instead, create app error object/class that extends the built-in Error object and use it whenever rejecting, throwing or emitting an error. The app error should add useful imperative properties like the error name/code and isCatastrophic. By doing so, all errors have a unified structure and support better error handling.
Use `logging` to capture error, too.
Method 1:

```js
// throwing an Error from typical function, whether sync or async
if (!productToAdd)
  throw new Error("How can I add new product when no value provided?");

// 'throwing' an Error from EventEmitter
const myEmitter = new MyEmitter();
myEmitter.emit("error", new Error("whoops!"));

// 'throwing' an Error from a Promise
const addProduct = async (productToAdd) => {
  try {
    const existingProduct = await DAL.getProduct(productToAdd.id);
    if (existingProduct !== null) {
      throw new Error("Product already exists!");
    }
  } catch (err) {
    // ...
  }
};
```

Method 2:

```js
// centralized error object that derives from Node’s Error
function AppError(name, httpCode, description, isOperational) {
  Error.call(this);
  Error.captureStackTrace(this);
  this.name = name;
  this.description = description;
  this.isOperational = isOperational;
}

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

module.exports.AppError = AppError;

// client throwing an exception
if (user == null)
  throw new AppError(
    commonErrors.resourceNotFound,
    commonHTTPErrors.notFound,
    "further explanation",
    true
  );
```

### Operational vs programmer errors

Distinguishing the following two error types will minimize your app downtime and helps avoid crazy bugs:

- Operational errors refer to situations where you understand what happened and the impact of it – for example, a query to some HTTP service failed due to connection problem.
- On the other hand, programmer errors refer to cases where you have no idea why and sometimes where an error came from – it might be some code that tried to read an undefined value or DB connection pool that leaks memory.
  Operational errors are relatively easy to handle – usually logging the error is enough. Things become hairy when a programmer error pops up, the application might be in an inconsistent state and there’s nothing better you can do than to restart gracefully

```js
// marking an error object as operational
const myError = new Error("How can I add new product when no value provided?");
myError.isOperational = true;

// or if you're using some centralized error factory (see other examples at the bullet "Use only the built-in Error object")
class AppError {
  constructor(commonType, description, isOperational) {
    Error.call(this);
    Error.captureStackTrace(this);
    this.commonType = commonType;
    this.description = description;
    this.isOperational = isOperational;
  }
}

throw new AppError(
  errorManagement.commonErrors.InvalidInput,
  "Describe here what happened",
  true
);
```

## Catch unhandled promise rejections

Typically, most of modern NodeJS application code runs within promises – whether within the .then handler, a function callback or in a catch block. Surprisingly, unless a developer remembered to add a .catch clause, errors thrown at these places are not handled by the uncaughtException event-handler and disappear. Recent versions of Node added a warning message when an unhandled rejection pops, though this might help to notice when things go wrong but it's obviously not a proper error handling method. The straightforward solution is to never forget adding .catch clauses within each promise chain call and redirect to a centralized error handler. However, building your error handling strategy only on developer’s discipline is somewhat fragile. Consequently, it’s highly recommended using a graceful fallback and subscribe to `process.on('unhandledRejection', callback)` – this will ensure that any promise error, if not handled locally, will get its treatment.

```js
// These errors will not get caught by any error handler (except unhandledRejection)
DAL.getUserById(1).then((johnSnow) => {
  // this error will just vanish
  if (johnSnow.isAlive === false) throw new Error("ahhhh");
});
```

```js
// Catching unresolved and rejected promises
process.on("unhandledRejection", (reason, p) => {
  // I just caught an unhandled promise rejection,
  // since we already have fallback handler for unhandled errors (see below),
  // let throw and let him handle that
  throw reason;
});

process.on("uncaughtException", (error) => {
  // I just received an error that was never handled, time to handle it and then decide whether a restart is needed
  errorManagement.handler.handleError(error);
  if (!errorManagement.handler.isTrustedError(error)) process.exit(1);
});
```

## Use naming conventions for variables, constants, functions and classes

Use *lowerCamelCase* when naming constants, variables and functions, *UpperCamelCase* (capital first letter as well) when naming classes and *UPPER_SNAKE_CASE* when naming global or static variables.

## Strive to be stateless

Store any type of *data* (e.g. user sessions, cache, uploaded files) within external data stores. When the app holds data in-process this adds additional layer of maintenance complexity like routing users to the same instance and higher cost of restarting a process. To enforce and encourage a stateless approach, most modern runtime platforms allows 'reapp-ing' instances periodically

## Set `NODE_ENV=production`

Set the environment variable `NODE_ENV` to ‘production’ or ‘development’ to flag whether production optimizations should get activated – some npm packages determine the current environment and optimize their code for production

## Install packages with `npm ci` in production

You locked your dependencies following `package-lock.json` but you now need to make sure those exact package versions are used in production.

Using `npm ci` to install packages will do exactly that and more.

- It will fail if your `package.json` and your `package-lock.json` do not match (they should) or if you don't have a lock file
- If a `node_modules` folder is present it will automatically remove it before installing
  Run `npm ci` to strictly do a clean install of your dependencies matching package.json and package-lock.json. Obviously production code must use the exact version of the packages that were used for testing. While package-lock.json file sets strict version for dependencies, in case of mismatch with the file package.json, the command 'npm install' will treat package.json as the source of truth. On the other hand, the command 'npm ci' will exit with error in case of mismatch between these files

## Securities

### Limit concurrent requests using a middleware

Rate limiting should be implemented in your application to protect a Node.js application from being overwhelmed by too many requests at the same time. Rate limiting is a task best performed with a service designed for this task, such as nginx, however it is also possible with [rate-limiter-flexible](https://www.npmjs.com/package/rate-limiter-flexible) package.

### Extract secrets from config files or use npm package that encrypts them

The most common and secure way to provide a Node.js application access to keys and secrets is to store them using environment variables on the system where it is being run. Once set, these can be accessed from the global `process.env` object

### Prevent query injection vulnerabilities with ORM/ODM libraries

To prevent SQL/NoSQL injection and other malicious attacks, always make use of an ORM/ODM or a database library that escapes data or supports named or indexed parameterized queries, and takes care of validating user input for expected types. Never just use JavaScript template strings or string concatenation to inject values into queries as this opens your application to a wide spectrum of vulnerabilities. All the reputable Node.js data access libraries (e.g. [Sequelize](https://github.com/sequelize/sequelize), [Knex](https://github.com/tgriesser/knex), [mongoose](https://github.com/Automattic/mongoose)) have built-in protection against injection attacks.
In many cases your system will be safe and sound by using a validation library like [joi](https://github.com/hapijs/joi) or [yup](https://github.com/jquense/yup) and an ORM/ODM from the list below.

#### Libraries

- [TypeORM](https://github.com/typeorm/typeorm)
- [sequelize](https://github.com/sequelize/sequelize)
- [mongoose](https://github.com/Automattic/mongoose)
- [Knex](https://github.com/tgriesser/knex)
- [Objection.js](https://github.com/Vincit/objection.js)
- [waterline](https://github.com/balderdashy/waterline)

### Adjust the HTTP response headers for enhanced security

There are security-related headers used to secure your application further. The most important headers are listed below. You can also visit the sites linked at the bottom of this page to get more information on this topic. You can easily set these headers using the [Helmet](https://www.npmjs.com/package/helmet) module for Express ([Helmet for koa](https://www.npmjs.com/package/koa-helmet)).

#### HTTP Strict Transport Security (HSTS)

HTTP Strict Transport Security (HSTS) is a web security policy mechanism to protect websites against [protocol downgrade attacks](https://en.wikipedia.org/wiki/Downgrade_attack) and [cookie hijacking](https://www.owasp.org/index.php/Session_hijacking_attack). It allows web servers to declare that web browsers (or other complying user agents) should only interact with it using **secure HTTPS connections**, and **never** via the insecure HTTP protocol. The HSTS policy is implemented by using the `Strict-Transport-Security` header over an existing HTTPS connection.

The Strict-Transport-Security Header accepts a `max-age` value in seconds, to notify the browser how long it should access the site using HTTPS only, and an `includeSubDomains` value to apply the Strict Transport Security rule to all of the site's subdomains.

Header Example - HSTS Policy enabled for one week, include subdomains

```bash
Strict-Transport-Security: max-age=2592000; includeSubDomains
```

#### Public Key Pinning for HTTP (HPKP)

HTTP Public Key Pinning (HPKP) is a security mechanism allowing HTTPS websites to resist impersonation by attackers using mis-issued or otherwise fraudulent SSL/TLS certificates.

The HTTPS web server serves a list of public key hashes, and on subsequent connections clients expect that server to use one or more of those public keys in its certificate chain. Using this feature carefully, you can greatly reduce the risk of man-in-the-middle (MITM) attacks and other false authentication problems for your application's users without incurring undue risk.

Before implementing you should have a look at the `Expect-CT` header first, due to its advanced flexibility for recovery from misconfiguration and other [advantages](https://groups.google.com/a/chromium.org/forum/m/#!msg/blink-dev/he9tr7p3rZ8/eNMwKPmUBAAJ).

The Public-Key-Pins header accepts 4 values, a `pin-sha256` value for adding the certificate public key, hashed using the SHA256 algorithm, which can be added multiple times for different public keys, a `max-age` value to tell the browser how long it should apply the rule, an `includeSubDomains` value to apply this rule to all subdomains and a `report-uri` value to report pin validation failures to the given URL.

Header Example - HPKP Policy enabled for one week, include subdomains , report failures to an example URL and allow two public keys

```bash
Public-Key-Pins: pin-sha256="d6qzRu9zOECb90Uez27xWltNsj0e1Md7GkYYkVoZWmM="; pin-sha256="E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g="; report-uri="http://example.com/pkp-report"; max-age=2592000; includeSubDomains
```

#### X-Frame-Options

The X-Frame-Options header secures the application against [Clickjacking](https://www.owasp.org/index.php/Clickjacking) attacks by declaring a policy whether your application may be embedded on other (external) pages using frames.

X-Frame-Options allows 3 parameters, a `deny` parameter to disallow embedding the resource in general, a `sameorigin` parameter to allow embedding the resource on the same host/origin and an `allow-from` parameter to specify a host where embedding of the resource is allowed.

Header Example - Deny embedding of your application

```bash
X-Frame-Options: deny
```

#### X-XSS-Protection

This header enables the [Cross-site scripting](<https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)>) filter in your browser.

It accepts 4 parameters, `0` for disabling the filter, `1` for enabling the filter and enable automatic sanitization of the page, `mode=block` to enable the filter and prevent the page from rendering if a XSS attack is detected (this parameter has to be added to `1` using a semicolon, and `report=<domainToReport>` to report the violation (this parameter has to be added to `1`).

Header Example - Enable XSS Protection and report violations to example URL

```bash
X-XSS-Protection: 1; report=http://example.com/xss-report
```

#### X-Content-Type-Options

Setting this header will prevent the browser from [interpreting files as something else](https://en.wikipedia.org/wiki/Content_sniffing) than declared by the content type in the HTTP headers.

Header Example - Disallow Content sniffing

```bash
X-Content-Type-Options: nosniff
```

#### Referrer-Policy

The Referrer-Policy HTTP header governs which referrer information, sent in the `Referer` header, should be included with requests made.

It allows 8 parameters, a `no-referrer` parameter to remove the `Referer` header completely, a `no-referrer-when-downgrade` to remove the `Referer` header when downgraded for example HTTPS -> HTTP, an `origin` parameter to send the host origin (the host root) as referrer **only**, an `origin-when-cross-origin` parameter to send a full origin URL when staying on the same origin and send the host origin **only** when otherwise, a `same-origin` parameter to send referrer information only for same-site origins and omit on cross-origin requests, a `strict-origin` parameter to keep the `Referer` header only on the same security-level (HTTPS -> HTTPS) and omit it on a less secure destination, a `strict-origin-when-cross-origin` parameter to send the full referrer URL to a same-origin destination, the origin **only** to a cross-origin destination on the **same** security level and no referrer on a less secure cross-origin destination, and an `unsafe-url` parameter to send the full referrer to same-origin or cross-origin destinations.

Header Example - Remove the `Referer` header completely

```bash
Referrer-Policy: no-referrer
```

### Expect-CT

The Expect-CT header is used by a server to indicate that browsers should evaluate connections to the host emitting the header for [Certificate Transparency](https://www.certificate-transparency.org/) compliance.

This header accepts 3 parameters, a `report-uri` parameter to supply a URL to report Expect-CT failures to, a `enforce` parameter to signal the browser that Certificate Transparency should be enforced (rather than only reported) and refuse future connections violating the Certificate Transparency, and a `max-age` parameter to specify the number of seconds the browser regard the host as a known Expect-CT host.

Header Example - Enforce Certificate Transparency for a week and report to example URL

```bash
Expect-CT: max-age=2592000, enforce, report-uri="https://example.com/report-cert-transparency"
```

#### Content-Security-Policy

The HTTP Content-Security-Policy response header allows to control resources the user agent is allowed to load for a given page. With a few exceptions, policies mostly involve specifying server origins and script endpoints. This helps guard against [cross-site scripting attacks (XSS)](<https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)>).
Header Example - Enable CSP and only execute scripts from the same origin

```bash
Content-Security-Policy: script-src 'self'
```

### Secure Your Users' Passwords

**Always** hash users' passwords as opposed to storing them as text; there are three options that depend on your use case for hashing user passwords.

- For the majority of use cases, the popular library [`bcrypt`](https://www.npmjs.com/package/bcrypt) can be used. (minimum: `cost:12`, password lengths must be <64)
- For a slightly harder native solution, or for unlimited size passwords, use the [`scrypt`](https://nodejs.org/dist/latest-v14.x/docs/api/crypto.html#crypto_crypto_scrypt_password_salt_keylen_options_callback) function. (minimums: `N:32768, r:8, p:1`)
- For FIPS/Government compliance use the older [`PBKDF2`](https://nodejs.org/dist/latest-v14.x/docs/api/crypto.html#crypto_crypto_pbkdf2_password_salt_iterations_keylen_digest_callback) function included in the native crypto module. (minimums: `iterations: 10000, length:{salt: 16, password: 32}`)
  Code example - Bcrypt

```js
const iterations = 12;
try {
  // asynchronously generate a secure password
  const hash = await bcrypt.hash("myPassword", iterations);
  // Store secure hash in user record

  // compare a provided password input with saved hash
  const match = await bcrypt.compare("somePassword", hash);
  if (match) {
    // Passwords match
  } else {
    // Passwords don't match
  }
} catch {
  logger.error("could not hash password.");
}
```

Code example - SCrypt

```js
const outSize = 64;
const hash = crypto
  .scryptSync("myUnlimitedPassword", "someUniqueUserValueForSalt", outSize)
  .toString("hex");

// Store secure hash in user record

// compare a provided password input with saved hash
const match =
  hash ===
  crypto
    .scryptSync("someUnlimitedPassword", "derivedSalt", outSize)
    .toString("hex");

if (match) {
  // Passwords match
} else {
  // Passwords don't match
}
```

Code example - PBKDF2 (Password-Based Key Derivation Function, Crypto Spec v2.1)

```js
try {
  const outSize = 64;
  const digest = "blake2b512";
  const iterations = 12;
  const hash = crypto
    .pbkdf2Sync(
      "myPassword",
      "someUniqueUserValueForSalt",
      iterations * 1000,
      digest,
      outSize
    )
    .toString("hex");

  // Store secure hash in user record

  // compare a provided password input with saved hash
  const match =
    hash ===
    crypto
      .pbkdf2Sync(
        "somePassword",
        "derivedSalt",
        iterations * 1000,
        digest,
        outSize
      )
      .toString("hex");

  if (match) {
    // Passwords match
  } else {
    // Passwords don't match
  }
} catch {
  logger.error("could not hash password.");
}
```

### Validate incoming JSON schemas

Validate the incoming requests' body payload and ensure it meets expectations, fail fast if it doesn't. To avoid tedious validation coding within each route you may use lightweight JSON-based validation schemas such as [jsonschema](https://www.npmjs.com/package/jsonschema) or [joi](https://www.npmjs.com/package/joi)
 This minimizes the attacker's surface who can no longer try out payloads with a different structure, values and length. Practically it prevents attacks like DDOS (code is unlikely to fail when the input is well defined) and Insecure Deserialization (JSON contain no surprises).
Example - JSON-Schema validation rules

```json
{
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "name": {
      "description": "Name of the product",
      "type": "string"
    },
    "price": {
      "type": "number",
      "exclusiveMinimum": 0
    }
  },
  "required": ["id", "name", "price"]
}
```

Example - Validating an entity using JSON-Schema

```js
const JSONValidator = require("jsonschema").Validator;

class Product {
  validate() {
    const v = new JSONValidator();

    return v.validate(this, schema);
  }

  static get schema() {
    //define JSON-Schema, see example above
  }
}
```

### Support blacklisting JWTs

When using JSON Web Tokens (for example, with [Passport.js](https://github.com/jaredhanson/passport)), by default there's no mechanism to revoke access from issued tokens. Once you discover some malicious user activity, there's no way to stop them from accessing the system as long as they hold a valid token. Mitigate this by implementing a blocklist of untrusted tokens that are validated on each request.

### Prevent brute-force attacks against authorization

Leaving higher privileged routes such as `/login` or `/admin` exposed without rate limiting leaves an application at risk of brute force password dictionary attacks. Using a strategy to limit requests to such routes can prevent the success of this by limiting the number of allow attempts based on a request property such as ip, or a body parameter such as username/email address.
 A simple and powerful technique is to limit authorization attempts using two metrics:

1. The first is number of consecutive failed attempts by the same user unique ID/name and IP address.
2. The second is number of failed attempts from an IP address over some long period of time. For example, block an IP address if it makes 100 failed attempts in one day.

### Run Node.js as Non-Root User

According to the 'Principle of least privilege' a user/process must be able to access only the necessary information and resources. Granting root access to an attacker opens a whole new world of malicious ideas like routing traffic to other servers. In practice, most Node.js apps don't need root access and don't run with such privileges. However, there are two common scenarios that might push to root usage:

- to gain access to privilege port (e.g. port 80) Node.js must run as root
- Docker containers by default run as root(!). It's recommended for Node.js web applications to listen on non-privileged ports and rely on a reverse-proxy like nginx to redirect incoming traffic from port 80 to your Node.js application. When building a Docker image, highly secured apps should run the container with an alternate non-root user. Most Docker clusters (e.g. Swarm, Kubernetes) allow setting the security context declaratively
  Run NodeJS as user, and direct via NGINX to NodeJS port

#### Limit payload size using a reverse-proxy or a middleware

The bigger the body payload is, the harder your single thread works in processing it. This is an opportunity for attackers to bring servers to their knees without tremendous amount of requests (DOS/DDOS attacks). Mitigate this limiting the body size of incoming requests on the edge (e.g. firewall, ELB) or by configuring [express body parser](https://github.com/expressjs/body-parser) to accept only small-size payloads
Example configuration for `nginx`

```nginx
http {
    ...
    # Limit the body size for ALL incoming requests to 1 MB
    client_max_body_size 1m;
}

server {
    ...
    # Limit the body size for incoming requests to this specific server block to 1 MB
    client_max_body_size 1m;
}

location /upload {
    ...
    # Limit the body size for incoming requests to this route to 1 MB
    client_max_body_size 1m;
}
```
