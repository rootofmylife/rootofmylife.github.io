# Firebase Init

## Preparation Step

Install firebase package globally:

```bash
npm -i -g firebase-tools
```

Unlock an experimental feature

```bash
firebase experiments:enable webframeworks
```

Then, login Firebase if you're not

```bash
firebase login
```

Then run this command to start specific service

```bash
firebase init hosting
```

You can run Emulator Suite

```bash
firebase init emulators
```

Then select emulators for Firestore, Authentication, and Hosting. You'll then see questions about port numbers and such, but I recommend going with the defaults. Once it's done you can boot up the emulators with the following command:

```bash
firebase emulators:start
```

If you'd like to [import from a seed or export any data](https://firebase.google.com/docs/emulator-suite/install_and_configure#startup) you create while the emulators are running you can add two flags.

```bash
firebase emulators:start --import=./seed --export-on-exit
```

## Usage

Install library for specific project

```bash
npm i firebase
```

Configure the object with firebase settings

```js
import { initializeApp } from "firebase/app";
const firebaseApp = initializeApp();
```

Import the Firebase services you need:

```js
import { getAuth } from "firebase/auth";
const auth = getAuth();
```

## Examples

### Authentication

Firebase Authentication allows you to manage users without running a server. Detecting login state is just a single function:

```js
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  // This callback fires with the user's login state.
  // If they aren't logged in, it's null
  // It's also in realtime! So it will fire when a login/logout occurs
});
```

The `onAuthStateChanged()` function takes a call back that fires in real time when a user either logs in or out. If we were to run this function right now, the result would be null because there's no user.

Let's change that.

Firebase Authentication comes with so many providers to pick from. My favorite is anonymous authentication. It works a bit like "sign in as a guest". It's fantastic for temporary transactions or for merging to a permanent account later on.

```js
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
const auth = getAuth();
onAuthStateChanged(auth, (user) => {});
signInAnonymously(auth);
```

Notice how the sign in function triggers the listener. This is a core concept in Firebase. We usually don't await the result of an async operation.

```js
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log(user.uid);
  }
});

// Nooooo! While this works (and sometimes is needed) we don't usually await the operation
// Why? Because we rely on the listener! That way you get all events instead just the first one
const user = await signInAnonymously(auth);
```

We use a listener to keep data flowing in real time. If we used `await` here, we would only get the initial login event and not any subsequent events such as a logout.

Now, this user gives us a `uid` property, which is crucial for saving and securing data in a database like FireStore.

### Firestore

Once we know the user is logged in, we'll call a function `syncData()` with the user information.

```js
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
const auth = getAuth();
const db = getFirestore();
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    syncData(user);
  }
});

function syncData(user) {
  const messagesRef = collection(db, `messages/${user.uid}`);
}
```

This function creates a reference to the messages stored on behalf of that user. And now for the fun part… reading the data in realtime.

```js
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection onSnapshot } from 'firebase/firestore';
const auth = getAuth();
const db = getFirestore();
onAuthStateChanged(auth, user => {
   if(user != null) {
      syncData(user);
   }
});

function syncData(user) {
   const messagesRef = collection(db, `messages/${user.uid}`);
   onSnapshot(messagesRef, snapshot => {
         const messages = snapshot.docs.map(doc => doc.data()
      );
// Now you can bind them to your UI. Whenever the data changes
// The UI will automatically stay up to date.
   });
}
```

The `onSnapshot()` function takes in a callback that is triggered anytime an update occurs. Inside the listener you can assign the results of the snapshot data to your UI, and now it's in sync.

And just like that, we have a real time functioning chat app. Now I want to deploy this, but you know what? There's one more thing to address.

### Security

#### Matching paths in Firestore

Security Rules work off of matching the paths of data that you store in Firestore.

```bash
rules_version = '2';
service cloud.firestore {
   match /databases/{database}/documents {
      // This is like a router: messages/:uid
      match /messages/{uid} {
      }
   }
}
```

Think of this like a router that matches routes with wildcard segments.

#### Allowing read/write operations

Once you've matched a path you specify an expression that determines whether a read or write is allowed.

```bash
rules_version = '2';
service cloud.firestore {
   match /databases/{database}/documents {
      // This is like a router: messages/:uid
      match /messages/{uid} {
         allow read: if true;
         allow write: if request.auth.uid == uid;
      }
   }
}
```

This rule allows anyone to read a message. However, only the user who owns the data can write.

Security Rules come with an entire set of variables you can access such as the incoming request. The request tells you who the current authenticated user is and we can use that to match against the `{uid}` wildcard created in the match statement.

#### Production for rules

When you set up the Emulator for Firestore, it created a file named `firestore.rules`. You can write the rules above in that file and the emulator will pick them up automatically. You can also use the CLI to deploy your security rules, so you don't have to go and copy and paste them into the console (that would be gross!).

```bash
firebase deploy --only firestore:rules
```

### Hosting

Let's checkout another new feature from the experiment! Typing `firebase deploy` detects Vite, runs the build, and ships it to Firebase Hosting.

```bash
firebase deploy
```
