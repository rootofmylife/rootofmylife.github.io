# Design Pattern

A **design pattern** is a reusable template for solving common software design ==problems==, enhancing code readability and efficiency and creating a common vocabulary.

You don't need to apply design pattern to your application if there is no problem.

Design pattern is just an idea, it's from community. Anyone can create a design pattern. It typically starts as a blog post or an article setting a name and explaining the problem and the solution that was already implemented in a real-world example.

Failures while using design patterns

- Overengineering
- Misapplication
- Inflexibility
- Learning Curve for the team
- Complexity
- Performance Overhead

## Single Page Application Pattern

Type of web application that interacts with the user by dynamically rewriting the current web page with new data from the web server, instead of loading entire new pages.

### Lazy Load

**Problem to Solve**: Loading too many JavaScript files when the app loads lead to performance and memory usage problems.
**Solution**: Use Dynamic Imports from ECMAScript to load modules when needed.
**Use Cases:**

- Load web components when you need them
- Load routes in SPA when you access them for the first time

For example

```js
// instead of import the module in the top of file
import RandomModule from './random.js'

// We will import when we need it
async function() {
    await import './random.js'
    // ...
}
```

### View Transitions

**Problem to Solve**: When changing between routes, there are no transitions as in most apps
**Solution**: Use the new View Transitions API.
**Use Cases**:

- Animate page change
- Morph elements between pages

For example:

```js
if (pageElement) {
  function changePage() {
    // get current page element
    let currentPage = document.querySelector("main").firstElementChild;
    if (currentPage) {
      currentPage.remove();
      document.querySelector("main").appendChild(pageElement);
    } else {
      document.querySelector("main").appendChild(pageElement);
    }
  }
  // Progressive Enhancement
  if (!document.startViewTransition) {
    changePage();
  } else {
    // Transition API <=======
    document.startViewTransition(() => changePage());
  }
}

window.scrollX = 0;
```

### HTML Templates with Interpolation

**Problem to Solve**: When using templates for Web Components, you can't express in the HTML the bindings you want.
**Solution**: Use a trick using with ES string templates that will let us interpolate with dynamic data from the HTML.
**Use Cases**:

- Define in the HTML the bindings for the data

```js
var name = "Alice";
var age = 25;

var tmpl = `My name is "${name}", and I'm ${age}`;
```

Template string will capture every tabs and new line to print into output, so be carefull

### Routing Metadata

**Problem to Solve**: When working with SPA, web page metadata, such as title, SEO data and other information stays static not matter the current URL.
**Solution**: Update the metadata dynamically when the route changes.
**Use Cases**:

- Adapt the theme-color
- Change the title
- Update the favicon based on the current page

## Multiple Page Application Pattern

Traditional web application architecture where each page of the application is served separately using a new request from the browser to the server.

### View Transitionss

**Problem to Solve**: When changing pages, users can see a white flash between page loads
**Solution**: Use the View Transitions API for cross-documents.
**Use Cases**:

- Make MPAs feel like SPAs
- Morph one element from one HTML to another element in the next HTML

### Prefetch

**Problem to Solve**: When the user wants to navigate to a new page, there is a performance penalty
**Solution**: Use different techniques to prefetch the next possible page, including using the Cache Storage with Service Workers or the Speculation Rules API.
**Use Cases**:

- Prefetch or pre-render the most probable next page on every HTML

### HTML Templates

**Problem to Solve**: Every new page navigation downloads a whole HTML including the header, footer and navigation again.
**Solution**: Use service workers to download partial HTML files when you navigate to a new page and marge them with a master page template client-side.
**Use Cases**:

- Improve Performance for MPAs

## Data and State Management Pattern

### Promisify Data

**Problem to Solve**: Data management tends to change in the future, and when working with static hardcoded data is difficult to move later to an async call.
**Solution**: Use Promises to deliver all data, including sync data by resolving the Promise statically.
**Use Cases**:

- Hardcoded data
- Access to sync APIs, such as Local Storage

### Flux

**Problem to Solve**: In large scale applications, managing the state of the app becomes too complex and unpredictable.
**Solution**: Use unidirectional data flow, simplifying the architecture and predictability of state changes.
**Use Cases**:

- Data Storage
- Form intense applications
- E-commerce
- CMSs

### Lazy Sync

Problem to Solve: Syncing data to the
server takes time and it's not always possible
**Solution**: Make all the sync to the server asynchronously and detached from the UI.
**Use Cases**:

- Save data and analytics
- Downloading news
- Updating app's components in the background

### Proxy

**Problem to Solve**: We don't have always control on the access to an object, including to detect when some value changes.
**Solution**: Use a Proxy object instead of the object directly.
**Use Cases**:

- Reactive Programming
- Adding a security layer
- Logging all access to important objects

### Middleware

**Problem to Solve**: Handling tasks that affect multiple parts of the application, like logging, security checks, error handling, authentication is difficult.
**Solution**: insert layers of processing between the initial request and the final response, like going through a pipeline.
**Use Cases**:

- API access
- Database access

### Virtual DOM

**Problem to Solve**: Working with the DOM directly is expensive
**Solution**: Create a virtual DOM in memory, work with it and synchronize it with the real DOM once it's a good time for it.
**Use Cases**:

- Complex user interfaces with lot of elements
- Large lists with re-order and CRUD operations
