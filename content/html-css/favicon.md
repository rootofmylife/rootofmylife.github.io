# Favicon

For the browser using HTML:

```html
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" href="/icon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" /><!-- 180×180 -->
```

If you’re making a PWA (Progressive Web App), also add this to the HTML:

```html
<link rel="manifest" href="/manifest.webmanifest" />
```

And a file with the web app manifest:

```json
// manifest.webmanifest
{
  "icons": [
    { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
    {
      "src": "/icon-mask.png",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "maskable"
    },
    { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" }
  ]
}
```

Maskable icons should have [bigger paddings](https://w3c.github.io/manifest/#icon-masks). The safe zone is a 409×409 circle. Use [maskable.app](https://maskable.app) to check your icon.

## Resources

- [evilmartians](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)

[https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

[https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)

[https://mobiforge.com/design-development/adding-favicons-in-a-multi-browser-multi-platform-world](https://mobiforge.com/design-development/adding-favicons-in-a-multi-browser-multi-platform-world)

https://realfavicongenerator.net/

[https://github.com/joshbuchea/HEAD?tab=readme-ov-file#icons](https://github.com/joshbuchea/HEAD?tab=readme-ov-file#icons)

[https://dev.to/prachi/simple-steps-to-replace-your-favicon-icon-in-angular-277b](https://dev.to/prachi/simple-steps-to-replace-your-favicon-icon-in-angular-277b)

```output
<link href="https://a-v2.sndcdn.com/assets/images/sc-icons/fluid-b4e7a64b8b.png" rel="fluid-icon">

<link href="https://a-v2.sndcdn.com/assets/images/sc-icons/ios-a62dfc8fe7.png" rel="apple-touch-icon">

<link href="https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico" rel="icon">
```
