# `nodemailer` setup for gmail

As mentioned in the comments and directly quoted from Google:

> On May 30 2022, you may lose access to apps that are using less secure sign-in technology

So the bottom code will probably stop working with **Gmail**. The solution is to **enable 2-Step Verification** and **generate Application password**, then you can use the generated password to send emails using *nodemailer*.To do so you need to do the following:

1. Go to your Google account at [https://myaccount.google.com/](https://myaccount.google.com/)
2. Go to **Security**
3. Choose **2-Step Verification** - here you have to verify yourself, in my case it was with phone number and a confirmation code send as text message. After that you will be able to enabled 2-Step Verification
4. Visit [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) to create your app.
5. Put a name *e.g. nodemailer* to your app and create it.
6. A modal dialog will appear with the password. Get that password and use it in your code.

## Sample usage

```javascript
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR-USERNAME",
    pass: "THE-GENERATED-APP-PASSWORD",
  },
});

send();

async function send() {
  const result = await transporter.sendMail({
    from: "YOUR-USERNAME",
    to: "RECEIVERS",
    subject: "Hello World",
    text: "Hello World",
  });

  console.log(JSON.stringify(result, null, 4));
}
```
