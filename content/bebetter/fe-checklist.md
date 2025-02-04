# Frontend Checklist

[https://socialsharepreview.com/](https://socialsharepreview.com/) or [https://www.opengraph.xyz/](https://www.opengraph.xyz/) or [https://socialmediasharepreview.com/](https://socialmediasharepreview.com/) ?

## Meta tag

- **Doctype:** The Doctype is HTML5 and is at the top of all your HTML pages.

```html
<!DOCTYPE html>
<!-- HTML5 -->
```

- **Charset:** The charset (UTF-8) is declared correctly.

```html
<!-- Set character encoding for the document -->
<meta charset="utf-8" />
```

- **Viewport:** The viewport is declared correctly.

```html
<!-- Viewport for responsive web design -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
/>
```

**Important:**

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<!--
  The above 2 meta tags *must* come first in the <head>
  to consistently ensure proper document rendering.
  Any other head element should come *after* these tags.
 -->
<title>Page Title</title>
```

`meta charset` - defines the encoding of the website, `utf-8` is the standard
`meta name="viewport"` - viewport settings related to mobile responsiveness
`width=device-width` - use the physical width of the device (great for mobile!)
`initial-scale=1` - the initial zoom, 1 means no zoom

- **Title:** A title is used on all pages (SEO: Google calculates the pixel width of the characters used in the title, and it cuts off between 472 and 482 pixels. The average character limit would be around 55-characters).

```html
<!-- Document Title -->
<title>Page Title less than 55 characters</title>
```

- **Description:** A meta description is provided, it is unique and doesn't possess more than 150 characters.

```html
<!-- Meta Description -->
<meta
  name="description"
  content="Description of the page less than 150 characters"
/>
```

- **Favicon:** Each favicon has been created and displays correctly. If you have only a `favicon.ico`, put it at the root of your site. Normally you won't need to use any markup. However, it's still good practice to link to it using the example below. Today, **PNG format is recommended** over `.ico` format (dimensions: 32x32px).

```html
<!-- Standard favicon -->
<link rel="icon" type="image/x-icon" href="https://example.com/favicon.ico" />
<!-- Recommended favicon format -->
<link rel="icon" type="image/png" href="https://example.com/favicon.png" />
<!-- Recommended modern favicon format (not recommended for legacy browsers) -->
<link rel="icon" type="image/svg+xml" href="https://example.com/favicon.svg" />
```

- **Apple Web App Meta:** Apple meta-tags are present.

```html
<!-- Apple Touch Icon (at least 200x200px) -->
<link rel="apple-touch-icon" href="/custom-icon.png" />

<!-- To run the web application in full-screen -->
<meta name="apple-mobile-web-app-capable" content="yes" />

<!-- Status Bar Style (see Supported Meta Tags below for available values) -->
<!-- Has no effect unless you have the previous meta tag -->
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
```

- **Windows Tiles:** Windows tiles are present and linked.

```html
<!-- Microsoft Tiles -->
<meta name="msapplication-config" content="browserconfig.xml" />
```

Minimum required xml markup for the `browserconfig.xml` file is as follows:

```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
   <msapplication>
     <tile>
        <square70x70logo src="small.png"/>
        <square150x150logo src="medium.png"/>
        <wide310x150logo src="wide.png"/>
        <square310x310logo src="large.png"/>
     </tile>
   </msapplication>
</browserconfig>
```

**Important:**

```html
<!-- For IE 10 and below -->
<!-- Place favicon.ico in the root directory - no tag necessary -->

<!-- Icon in the highest resolution we need it for -->
<link rel="icon" sizes="192x192" href="/path/to/icon.png" />

<!-- Apple Touch Icon (reuse 192px icon.png) -->
<link rel="apple-touch-icon" href="/path/to/apple-touch-icon.png" />

<!-- Safari Pinned Tab Icon -->
<link rel="mask-icon" href="/path/to/icon.svg" color="blue" />
```

- **Canonical:** Use `rel="canonical"` to avoid duplicate content.

```html
<!-- Helps prevent duplicate content issues -->
<link
  rel="canonical"
  href="http://example.com/2017/09/a-new-article-to-read.html"
/>
```

Valid `<head>` elements include `meta`, `link`, `title`, `style`, `script`, `noscript`, and `base`.
These elements provide information for how a document should be perceived, and rendered, by web technologies. e.g. browsers, search engines, bots, etc.

```html
<!--
  Set the character encoding for this document, so that
  all characters within the UTF-8 space (such as emoji)
  are rendered correctly.
-->
<meta charset="utf-8" />

<!-- Set the document's title -->
<title>Page Title</title>

<!-- Set the base URL for all relative URLs within the document -->
<base href="https://example.com/page.html" />

<!-- Link to an external CSS file -->
<link rel="stylesheet" href="styles.css" />

<!-- Used for adding in-document CSS -->
<style>
  /* ... */
</style>

<!-- JavaScript & No-JavaScript tags -->
<script src="script.js"></script>
<script>
  // function(s) go here
</script>
<noscript>
  <!-- No JS alternative -->
</noscript>
```

## HTML tags

- **Language attribute:** The `lang` attribute of your website is specified and related to the language of the current page.

```html
<html lang="en"></html>
```

- **Direction attribute:** The direction of lecture is specified on the html tag (It can be used on another HTML tag).

```html
<html dir="rtl"></html>
```

- **Alternate language:** The language tag of your website is specified and related to the language of the current page.

```html
<link rel="alternate" href="https://es.example.com/" hreflang="es" />
```

- **x-default:** The language tag of your website for international landing pages.

```html
<link rel="alternate" href="https://example.com/" hreflang="x-default" />
```

## Links

```html
<!-- Points to an external stylesheet -->
<link rel="stylesheet" href="https://example.com/styles.css" />

<!-- Helps prevent duplicate content issues -->
<link rel="canonical" href="https://example.com/article/?page=2" />

<!-- Links to an AMP HTML version of the current document -->
<link rel="amphtml" href="https://example.com/path/to/amp-version.html" />

<!-- Links to a JSON file that specifies "installation" credentials for the web applications -->
<link rel="manifest" href="manifest.json" />

<!-- Links to information about the author(s) of the document -->
<link rel="author" href="humans.txt" />

<!-- Refers to a copyright statement that applies to the link's context -->
<link rel="license" href="copyright.html" />

<!-- Gives a reference to a location in your document that may be in another language -->
<link rel="alternate" href="https://es.example.com/" hreflang="es" />

<!-- Provides information about an author or another person -->
<link rel="me" href="https://google.com/profiles/thenextweb" type="text/html" />
<link rel="me" href="mailto:name@example.com" />
<link rel="me" href="sms:+15035550125" />

<!-- Links to a document that describes a collection of records, documents, or other materials of historical interest -->
<link rel="archives" href="https://example.com/archives/" />

<!-- Links to top level resource in an hierarchical structure -->
<link rel="index" href="https://example.com/article/" />

<!-- Provides a self reference - useful when the document has multiple possible references -->
<link
  rel="self"
  type="application/atom+xml"
  href="https://example.com/atom.xml"
/>

<!-- The first, last, previous, and next documents in a series of documents, respectively -->
<link rel="first" href="https://example.com/article/" />
<link rel="last" href="https://example.com/article/?page=42" />
<link rel="prev" href="https://example.com/article/?page=1" />
<link rel="next" href="https://example.com/article/?page=3" />

<!-- Used when a 3rd party service is utilized to maintain a blog -->
<link
  rel="EditURI"
  href="https://example.com/xmlrpc.php?rsd"
  type="application/rsd+xml"
  title="RSD"
/>

<!-- Forms an automated comment when another WordPress blog links to your WordPress blog or post -->
<link rel="pingback" href="https://example.com/xmlrpc.php" />

<!-- Notifies a URL when you link to it on your document -->
<link rel="webmention" href="https://example.com/webmention" />

<!-- Enables posting to your own domain using a Micropub client -->
<link rel="micropub" href="https://example.com/micropub" />

<!-- Open Search -->
<link
  rel="search"
  href="/open-search.xml"
  type="application/opensearchdescription+xml"
  title="Search Title"
/>

<!-- Feeds -->
<link
  rel="alternate"
  href="https://feeds.feedburner.com/example"
  type="application/rss+xml"
  title="RSS"
/>
<link
  rel="alternate"
  href="https://example.com/feed.atom"
  type="application/atom+xml"
  title="Atom 0.3"
/>

<!-- Prefetching, preloading, prebrowsing -->
<!-- More info: https://css-tricks.com/prefetching-preloading-prebrowsing/ -->
<link rel="dns-prefetch" href="//example.com/" />
<link rel="preconnect" href="https://www.example.com/" />
<link rel="prefetch" href="https://www.example.com/" />
<link rel="prerender" href="https://example.com/" />
<link rel="preload" href="image.png" as="image" />
```

## Social meta

- **Facebook Open Graph:** All Facebook Open Graph (OG) are tested and no one is missing or with false information. Images need to be at least 600 x 315 pixels, although 1200 x 630 pixels is recommended.
  > **Notes:** Using `og:image:width` and `og:image:height` will specify the image dimensions to the crawler so that it can render the image immediately without having to asynchronously download and process it.

```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://example.com/page.html" />
<meta property="og:title" content="Content Title" />
<meta property="og:image" content="https://example.com/image.jpg" />
<meta property="og:description" content="Description Here" />
<meta property="og:site_name" content="Site Name" />
<meta property="og:locale" content="en_US" />
<!-- Next tags are optional but recommended -->
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

Second:

```html
<meta property="fb:app_id" content="123456789" />
<meta property="og:url" content="https://example.com/page.html" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Content Title" />
<meta property="og:image" content="https://example.com/image.jpg" />
<meta
  property="og:image:alt"
  content="A description of what is in the image (not a caption)"
/>
<meta property="og:description" content="Description Here" />
<meta property="og:site_name" content="Site Name" />
<meta property="og:locale" content="en_US" />
<meta property="article:author" content="" />
```

- **Twitter Card:**

```html
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="@site_account" />
<meta name="twitter:creator" content="@individual_account" />
<meta name="twitter:url" content="https://example.com/page.html" />
<meta name="twitter:title" content="Content Title" />
<meta
  name="twitter:description"
  content="Content description less than 200 characters"
/>
<meta name="twitter:image" content="https://example.com/image.jpg" />
```

Second:

```html
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="@site_account" />
<meta name="twitter:creator" content="@individual_account" />
<meta name="twitter:url" content="https://example.com/page.html" />
<meta name="twitter:title" content="Content Title" />
<meta
  name="twitter:description"
  content="Content description less than 200 characters"
/>
<meta name="twitter:image" content="https://example.com/image.jpg" />
<meta
  name="twitter:image:alt"
  content="A text description of the image conveying the essential nature of an image to users who are visually impaired. Maximum 420 characters."
/>
```

**Note for Twitter:**

```html
<!-- disallow Twitter from using your site's info for personalization purposes -->
<meta name="twitter:dnt" content="on" />
```

**Important:**

```html
<!--
  The following 2 meta tags *must* come first in the <head>
  to consistently ensure proper document rendering.
  Any other head element should come *after* these tags.
-->
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

<!--
  Allows control over where resources are loaded from.
  Place as early in the <head> as possible, as the tag  
  only applies to resources that are declared after it.
-->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'" />

<!-- Name of web application (only should be used if the website is used as an app) -->
<meta name="application-name" content="Application Name" />

<!-- Theme Color for Chrome, Firefox OS and Opera -->
<meta name="theme-color" content="#4285f4" />

<!-- Short description of the document (limit to 150 characters) -->
<!-- This content *may* be used as a part of search engine results. -->
<meta name="description" content="A description of the page" />

<!-- Control the behavior of search engine crawling and indexing -->
<meta name="robots" content="index,follow" /><!-- All Search Engines -->
<meta name="googlebot" content="index,follow" /><!-- Google Specific -->

<!-- Tells Google not to show the sitelinks search box -->
<meta name="google" content="nositelinkssearchbox" />

<!-- Tells Google not to provide a translation for this document -->
<meta name="google" content="notranslate" />

<!-- Verify website ownership -->
<meta
  name="google-site-verification"
  content="verification_token"
/><!-- Google Search Console -->
<meta
  name="yandex-verification"
  content="verification_token"
/><!-- Yandex Webmasters -->
<meta
  name="msvalidate.01"
  content="verification_token"
/><!-- Bing Webmaster Center -->
<meta name="alexaVerifyID" content="verification_token" /><!-- Alexa Console -->
<meta
  name="p:domain_verify"
  content="code_from_pinterest"
/><!-- Pinterest Console-->
<meta
  name="norton-safeweb-site-verification"
  content="norton_code"
/><!-- Norton Safe Web -->

<!-- Identify the software used to build the document (i.e. - WordPress, Dreamweaver) -->
<meta name="generator" content="program" />

<!-- Short description of your document's subject -->
<meta name="subject" content="your document's subject" />

<!-- Gives a general age rating based on the document's content -->
<meta name="rating" content="General" />

<!-- Allows control over how referrer information is passed -->
<meta name="referrer" content="no-referrer" />

<!-- Disable automatic detection and formatting of possible phone numbers -->
<meta name="format-detection" content="telephone=no" />

<!-- Completely opt out of DNS prefetching by setting to "off" -->
<meta http-equiv="x-dns-prefetch-control" content="off" />

<!-- Specifies the document to appear in a specific frame -->
<meta http-equiv="Window-Target" content="_value" />

<!-- Geo tags -->
<meta name="ICBM" content="latitude, longitude" />
<meta name="geo.position" content="latitude;longitude" />
<meta
  name="geo.region"
  content="country[-state]"
/><!-- Country code (ISO 3166-1): mandatory, state code (ISO 3166-2): optional; eg. content="US" / content="US-NY" -->
<meta
  name="geo.placename"
  content="city/town"
/><!-- eg. content="New York City" -->

<!-- Web Monetization https://webmonetization.org/docs/getting-started -->
<meta name="monetization" content="$paymentpointer.example" />
```

## HTML testing

- **W3C compliant:** All pages need to be tested with the W3C validator to identify possible issues in the HTML code.

  - [W3C validator](https://validator.w3.org/)

- **HTML Lint:** I use tools to help me analyze any issues I could have on my HTML code.

  - [Dirty markup](https://www.10bestdesign.com/dirtymarkup/)
  - [webhint](https://webhint.io/)

- **Link checker:** There are no broken links in my page, verify that you don't have any 404 error.
  - [W3C Link Checker](https://validator.w3.org/checklink)

### Webfonts

- **Webfont format:** WOFF, WOFF2 and TTF are supported by all modern browsers.
- **Webfont size:** Webfont sizes don't exceed 2 MB (all variants included).
- **Use `preconnect` to load your fonts faster:**

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## CSS

- **Responsive Web Design:** The website is using responsive web design.
- **Reset CSS:** A CSS reset (reset, normalize or reboot) is used and up to date. *(If you are using a CSS Framework like Bootstrap or Foundation, a Normalize is already included into it.)*
- **Embedded or inline CSS:** Avoid at all cost embedding CSS in `<style>` tags or using inline CSS: only use for valid reasons (e.g. background-image for slider, critical CSS).
- **Concatenation:** CSS files are concatenated in a single file *(Not for HTTP/2)*.
- **Minification:** All CSS files are minified.
- **Unused CSS:** Remove unused CSS.

## Images

- **Optimization:** All images are optimized to be rendered in the browser. WebP format could be used for critical pages (like Homepage).
- **Use vector image vs raster/bitmap:** Prefer using vector image rather than bitmap images (when possible).
- **Avoid using Base64 images:** You could eventually convert tiny images to base64 but it's actually not the best practice.
- **Images dimensions:** Set `width` and `height` attributes on `<img>` if the final rendered image size is known.

## JavaScript

- **JavaScript Inline:** You don't have any JavaScript code inline (mixed with your HTML code).
- **Minification:** JavaScript files are minified (you can add the `.min` suffix).
- **`noscript` tag:** Use `<noscript>` tag in the HTML body if a script type on the page is unsupported or if scripting is currently turned off in the browser. This will be helpful in client-side rendering heavy apps such as React.js.

```html
<noscript> You need to enable JavaScript to run this app. </noscript>
```

- **Non-blocking:** JavaScript files are loaded asynchronously using `async` or deferred using `defer` attribute.

## Security

- **HTTPS:** HTTPS is used on every page and for all external content (plugins, images...).
- **HTTP Strict Transport Security (HSTS):** The HTTP header is set to 'Strict-Transport-Security'.
- **Cross Site Request Forgery (CSRF):** You ensure that requests made to your server-side are legitimate and originate from your website / app to prevent CSRF attacks.
- **Cross Site Scripting (XSS):** Your page or website is free from XSS possible issues.
- **Content Type Options:** Prevents Google Chrome and Internet Explorer from trying to mime-sniff the content-type of a response away from the one being declared by the server.
- **X-Frame-Options (XFO):** Protects your visitors against clickjacking attacks.
- **Content Security Policy:** Defines how content is loaded on your site and from where it is permitted to be loaded. Can also be used to protect against clickjacking attacks.

## Performance

- **Goals to achieve:** Your pages should reach these goals:
  - First Meaningful Paint under 1 second
  - Time To Interactive under 5 seconds for the "average" configuration (a $200 Android on a slow 3G network with 400ms RTT and 400kbps transfer speed) and under 2 seconds for repeat visits
  - Critical file size under 170Kb gzipped
  - **Page weight < 1500 KB (ideally < 500 KB):** Reduce the size of your page + resources as much as you can.
  - **Page load times < 3 seconds:** Reduce as much as possible your page load times to quickly deliver your content to your users.
  - **Time To First Byte < 1.3 seconds:** Reduce as much as you can the time your browser waits before receiving data.
- **Inified HTML:** Your HTML is minified.
- **Lazy loading:** Images, scripts and CSS need to be lazy loaded to improve the response time of the current page (See details in their respective sections).
- **Cookie size:** f you are using cookies be sure each cookie doesn't exceed 4096 bytes and your domain name doesn't have more than 20 cookies.
- **Place CSS tags always before JavaScript tags:** Ensure that your CSS is always loaded before having JavaScript code.

```html
<!-- Not recommended -->
<script src="jquery.js"></script>
<script src="foo.js"></script>
<link rel="stylesheet" href="foo.css" />

<!-- Recommended -->
<link rel="stylesheet" href="foo.css" />
<script src="jquery.js"></script>
<script src="foo.js"></script>
```

- **Use a CDN to deliver your assets:** Use a CDN to deliver faster your content over the world.
- **Serve files from the same protocol:** Avoid having your website serving files coming from source using HTTP on your website which is using HTTPS for example. If your website is using HTTPS, external files should come from the same protocol.
- **Set HTTP cache headers properly:** Set HTTP headers to avoid expensive number of roundtrips between your browser and the server.
- **GZIP / Brotli compression is enabled:** Use a compression method such as Gzip or Brotli to reduce the size of your JavaScript files. With a smaller sizes file, users will be able to download the asset faster, resulting in improved performance.

## Meta-files

- **sitemap.xml:** A sitemap.xml exists and was submitted to Google Search Console (previously Google Webmaster Tools).
- **robots.txt:** The robots.txt is not blocking webpages.

## Setup for iOS platform

```html
<!-- Smart App Banner -->
<meta
  name="apple-itunes-app"
  content="app-id=APP_ID,affiliate-data=AFFILIATE_ID,app-argument=SOME_TEXT"
/>

<!-- Disable automatic detection and formatting of possible phone numbers -->
<meta name="format-detection" content="telephone=no" />

<!-- Launch Icon (180x180px or larger) -->
<link rel="apple-touch-icon" href="/path/to/apple-touch-icon.png" />

<!-- Launch Screen Image -->
<link rel="apple-touch-startup-image" href="/path/to/launch.png" />

<!-- Launch Icon Title -->
<meta name="apple-mobile-web-app-title" content="App Title" />

<!-- Enable standalone (full-screen) mode -->
<meta name="apple-mobile-web-app-capable" content="yes" />

<!-- Status bar appearance (has no effect unless standalone mode is enabled) -->
<meta name="apple-mobile-web-app-status-bar-style" content="black" />

<!-- iOS app deep linking -->
<meta
  name="apple-itunes-app"
  content="app-id=APP-ID, app-argument=http/url-sample.com"
/>
<link rel="alternate" href="ios-app://APP-ID/http/url-sample.com" />
```

### Setup for Android

```html
<meta name="theme-color" content="#E64545" />

<!-- Add to home screen -->
<meta name="mobile-web-app-capable" content="yes" />
<!-- More info: https://developer.chrome.com/multidevice/android/installtohomescreen -->

<!-- Android app deep linking -->
<meta name="google-play-app" content="app-id=package-name" />
<link rel="alternate" href="android-app://package-name/http/url-sample.com" />
```

## GG Chrome

```html
<link
  rel="chrome-webstore-item"
  href="https://chrome.google.com/webstore/detail/APP_ID"
/>

<!-- Disable translation prompt -->
<meta name="google" content="notranslate" />
```

## Microsoft IE

```html
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@site_account">
<meta name="twitter:creator" content="@individual_account">
<meta name="twitter:url" content="https://example.com/page.html">
<meta name="twitter:title" content="Content Title">
<meta name="twitter:description" content="Content description less than 200 characters">
<meta name="twitter:image" content="https://example.com/image.jpg">
<meta name="twitter:image:alt" content="A text description of the image conveying the essential nature of an image to
```

Minimum required xml markup for `browserconfig.xml`:

```html
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="small.png" />
      <square150x150logo src="medium.png" />
      <wide310x150logo src="wide.png" />
      <square310x310logo src="large.png" />
    </tile>
  </msapplication>
</browserconfig>
```
