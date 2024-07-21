const nextButton = document.getElementById("next");
const backButton = document.getElementById("back");
const subSelect = document.getElementById("sub");
const img = document.getElementById("img");
const loading = document.getElementById("loading");

const LOADING_ERROR_URL =
  "https://jhusain.github.io/reddit-image-viewer/error.png";
const Observable = Rx.Observable;

// function which returns an array of image URLs for a given reddit sub
// getSubImages("pics") ->
// [
//   "https://upload.wikimedia.org/wikipedia/commons/3/36/Hopetoun_falls.jpg",
//   "https://upload.wikimedia.org/wikipedia/commons/3/38/4-Nature-Wallpapers-2014-1_ukaavUI.jpg",
//   ...
// ]
function getSubImages(sub) {
  const cachedImages = localStorage.getItem(sub);
  if (cachedImages) {
    return Observable.of(JSON.parse(cachedImages));
  } else {
    const url = `https://www.reddit.com/r/${sub}/.json?limit=200&show=all`;

    // defer ensure new Observable (and therefore) promise gets created
    // for each subscription. This ensures functions like retry will
    // issue additional requests.
    return Observable.defer(() =>
      Observable.fromPromise(
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            const images = data.data.children.map((image) => image.data.url);
            localStorage.setItem(sub, JSON.stringify(images));
            return images;
          })
      )
    );
  }
}

// ---------------------- INSERT CODE  HERE ---------------------------
const subs = Observable.concat(
  Observable.of(subSelect.value),
  Observable.fromEvent(subSelect, "change").map((ev) => ev.target.value)
);

// This mechanism can be used, for example, to navigate through a series of pages or items
// by incrementing or decrementing an index based on user clicks.

/**
Assuming nextButton is clicked twice and then backButton is clicked once, here's how the values would change:
- nexts emits a value each time the nextButton is clicked.
- backs emits a value each time the backButton is clicked.
- offsets would emit 1 for each "next" click and -1 for the "back" click. So, the sequence of emissions would be [1, 1, -1].
- indices would start with 0, and then add each offset to the accumulated index. 
The sequence of emitted indices would be [0, 1, 2, 1], where 0 is the initial index, 1 after the first "next" click, 
2 after the second "next" click, and back to 1 after the "back" click.
 */
const nexts = Observable.fromEvent(nextButton, "click");

const backs = Observable.fromEvent(backButton, "click");

const offsets = Observable.merge(
  nexts.map(() => 1),
  backs.map(() => -1)
);

const indices = Observable.concat(
  Observable.of(0),
  offsets.scan((acc, curr) => acc + curr, 0)
);

const images = subs
  .map((sub) =>
    getSubImages(sub)
      .map((images) =>
        indices
          .filter((index) => index >= 0 && index < images.length)
          .map((index) => images[index])
      )
      .switch()
      .map(preloadImage)
      .switch()
  )
  .switch();

// This "actions" Observable is a placeholder. Replace it with an
// observable that notfies whenever a user performs an action,
// like changing the sub or navigating the images
const actions = Observable.merge(subs, nexts, backs);

actions.subscribe(() => (loading.style.visibility = "visible"));

images.subscribe({
  next(url) {
    // hide the loading image
    loading.style.visibility = "hidden";

    // set Image source to URL
    img.src = url;
  },
  error(e) {
    alert(
      "I'm having trouble loading the images for that sub. Please wait a while, reload, and then try again later."
    );
  },
});

function preloadImage(src) {
  // defer ensures the image is only loaded when the Observable is subscribed to
  // Becasue we don't know that will fire event first or after we set src
  return Observable.defer(() => {
    const img = new Image();
    const success = Observable.fromEvent(img, "load").map(() => src);

    const failure = Observable.fromEvent(img, "error").map(
      () => LOADING_ERROR_URL
    );

    img.src = src;

    return Observable.merge(success, failure);
  });
}
