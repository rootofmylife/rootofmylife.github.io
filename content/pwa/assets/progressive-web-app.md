Most of companies like Apple, MS call this as ==web apps== than PWA.

Resources: web.dev

## Web App Manifest

You can have more than one installable web app (PWA) in the same origin, if you point to different Web App Manifest files.

It's recommend to host them in different folders.

It allows to the micro-app architectural pattern.

By this, you can customize your web app to point to different manifest file based on user-specific needs.

`app.webmanifest`

```json
{
	"id": "theidofyourapp.couldbeyoururl",
    "name": "The best PWA in town",
    "short_name": "Codepad",
    "start_url": "./?utm_source=pwa",
    "theme_color": "#ffc252",
    "scope": "./",
    "display": "standalone",
    "icons": [
        {
            "src": "icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        },
        {
            "src": "icons/icon-1024.png",
            "sizes": "1024x1024",
            "type": "image/png"
        },
        {
            "src": "icons/icon-maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        }     
    ],
    "description": "This app lets you add notes while you are coding",
    "screenshots": [
        {
            "src": "icons/screenshot.png",
            "sizes": "1170x2532",
            "type": "image/png"
        }
    ]
}
```

`start_url`: the browser will pick the current URL when user install the app. So if user is not in the homepage, that's your trouble

`scope`: if you have outside URL, when user clicks on it, it should show the bar that has the outside URL

Now link manifest file into your html

```html
<link rel="manifest" href="app.webmanifest?1">
```

## Icons in the Manifest

Format: PNG - (RGB)
Used on Android and Desktop OS
Recommended sizes: 192, 512, 1024

Also, notice about maskable icons. Use maskable.app to create icon to adapt icon launcher in every devices. In manifest file, add `purpose` for icon:

```
{
	"src": "icons/icon-maskable.png",
	"sizes": "512x512",
	"type": "image/png",
	"purpose": "maskable"
}
```

For iOS or macOS, you can rewrite icon using a link. ==If one icon is provided, 180x180 is recommended size==. In html:

```html
<link rel="apple-touch-icom" href="ios_icon.png">
<link rel="apple-touch-icom" href="ios_icon.png" sizes="120x120">
```

## Detect Browser

Using [Wurl](https://web.wurfl.io)

For Safari in Mobile, use `window.standalone`, this will be `true` if Safari is on Mobile, `false` if on others
Other browsers will be `undefined`

## Splash Screen

Splash screen are automatically generated on Android. It will take these proerties from manifest files: `theme_color`, `background_color`, `icon_512x512.png`, `name`

For iOS, Safari won't use the App Manifest meta data. So we can create own static images (aka Startup Images) and define them through a `<link>`. But you have to create a lot of images with exact pixel to each iOS device.

## Service Worker

Each website only has one SW
SW runs in background
No need for user's permission
SW manages all pages within browser and within installed app from scope

### Caching resources
- SW has a local cache
- JS promise
- Cache on request

### Usage

Import in html

```html
<script src="sw-register.js"></script>
```

`sw-register.js`
```js
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register("serviceworker.js")
}
```

Make sure you create `serviceworker.js` in project root or same level with index html. If not, SW wont be loaded

```js
// v2

const assets = ["/", "styles.css", "app.js", "sw-register.js", 
"https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2"];

self.addEventListener("install", event => {
    event.waitUntil(
	    // this will store all resources/assets in cache
	    // to use when in offline mode
	    // these resources are stored in client side
        caches.open("assets").then( cache => {
            cache.addAll(assets);
        })
    );
    // self.skipWaiting(); // activate the service worker immediately
});

// Cache first strategy
// Website will try to find resources in cache first, if not there, it will fetch from server
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)  // searching in the cache
            .then( response => {
                if (response) {
                    // The request is in the cache 
                    return response; // cache hit
                } else {
                    // We need to go to the network  
                    return fetch(event.request);  // cache miss
                }
            })
    );
});

// Network first strategy
// Website will fetch resources from server, if failt, it will get resources from cache
self.addEventListener('fetch', event => {
    event.respondWith(
      fetch(event.request) // I go to the network ALWAYS
        .catch( error => {  // if the network is down, I go to the cache
            return caches.open("assets")
                    .then( cache => {
                         return cache.match(request);
                 });
        })
    );
});

// State while revalidate strategy
// Website will get resources from cache and also get resources in server. If there is resources in cache, use it. If not, update the cache with resources retrieved from server. Even if the resources are available in cache, it still calls the server and update the resource if needed
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then( cachedResponse => {
                // Even if the response is in the cache, we fetch it
                // and update the cache for future usage
                const fetchPromise = fetch(event.request).then(
                     networkResponse => {
                        caches.open("assets").then( cache => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    });
                // We use the currently cached version if it's there
                return cachedResponse || fetchPromise; // cached or a network fetch
            })
        );
    }); 

// self.addEventListener("fetch", event => {
//     event.respondWith(
//         caches.match(event.request)  // searching in the cache
//             .then( response => {
//                 if (response) {
//                     // The request is in the cache 
//                     return response; // cache hit
//                 } else {
//                     // We need to go to the network  
//                     return fetch(event.request);  // cache miss
//                 }
//             })
//     );
// });
```

## Avoid Content Selection

In case we want user can not select elements on PWA, we can use this technique

```css
.elements {
	user-select: none;
	-webkit-user-select: none;
}
```

## Use Safe Areas

In iPhone, we have some area that we don't want to show our content, because it's behind that area (notch, island).

With CSS Environmental Variables support through the env() function and four variables

```css
.container {
	margin: env(safe-area-inset-top)
		env(safe-area-inset-right)
		env(safe-area-inset-bottom)
		env(safe-area-inset-left)
}
```

We can also add default values if that variable is not available, but only when env()

```css
.container {
	margin: env(safe-area-inset-top, 5px)
		env(safe-area-inset-right, 5px)
		env(safe-area-inset-bottom)
		env(safe-area-inset-left)
}
```

Adding two declaration in this orden will make these default values available for every

```css
.container {
	margin: 5px 5px 0 0;
	margin: env(safe-area-inset-top, 5px)
		env(safe-area-inset-right, 5px)
		env(safe-area-inset-bottom)
		env(safe-area-inset-left)
}
```

Devices with Notch

![[Pasted image 20241014214018.png]]

## Viewport Area

Usually, your content will be like this

![[Pasted image 20241014224523.png]]

It's in the default viewport

![[Pasted image 20241014224552.png]]

So, for Cover Viewport, we can ask the availability for all the viewport for us with the viewport meta tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

![[Pasted image 20241014224745.png]]

![[Pasted image 20241014224800.png]]

Then we can add the margin to avoid the notch
![[Pasted image 20241014224839.png]]

In iOS, you can use to make your app fullscreen

```css
<meta name="apple-mobile-web-app-status-bar-style"
		content="black-translucent">
```
## Installation

First, create a button to install 

```html
<button id="btnInstall">
	Install
</button>
```

Then, create a event listener to listen to PWA event

```js
let bitEvent = null;

window.addEventListener("beforeinstallprompt", event => {
	event.preventDefault();
	bitEvent = event;
})
```

Then, stick the install function into the button

```js
document.getDocumentById("btnInstall").addEventListener("click", e => {
	if (bitEvent) {
		bitEvent.prompt()
	} else {
		alert("Install manually")
	}
})
```

In CSS, you can check the `display-mode` to the same with one in manifest file `"display": "standalone"`

```css
@media (display-mode: standalone) {
	#btnInstall {
		display: hidden;
	}
}
```