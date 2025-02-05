# JS History

## JavaScript versus ECMAScript

JavaScript is what everyone calls the language, but that name is trademarked (by Oracle, which inherited the trademark from Sun). Therefore, the official name of JavaScript is _ECMAScript_. That name comes from the standards organization Ecma, which manages the language standard. Since ECMAScript’s inception, the name of the organization has changed from the acronym “ECMA” to the proper name “Ecma”.

Versions of JavaScript are defined by specifications that carry the official name of the language. Hence, the first standard version of JavaScript is ECMAScript 1 which is short for “ECMAScript Language Specification, Edition 1”. ECMAScript x is often abbreviated ESx.

## A brief history of ECMAScript

### 1.7.1 The early years: ECMAScript 1–3

- **ECMAScript 1 (June 1997)** was the first version of the JavaScript language standard.
- **ECMAScript 2 (June 1998)** contained minor changes, to keep the spec in sync with a separate ISO standard for JavaScript.
- **ECMAScript 3 (December 1999)** introduced many features that have become popular parts of the language, as described in the introduction of the ES6 specification: “[…] regular expressions, better string handling, new control statements, try/catch exception handling, tighter definition of errors, formatting for numeric output and other enhancements.”

### 1.7.2 ECMAScript 4 (abandoned in July 2008)

Work on ES4 started after the release of ES3 in 1999. In 2003, an interim report was released after which work on ES4 paused. Subsets of the language described in the interim report were implemented by Adobe (in ActionScript) and by Microsoft (in JScript.NET).

In February 2005, Jesse James Garrett observed that a combination of techniques had become popular for implementing dynamic frontend apps in JavaScript. He called those techniques Ajax. Ajax enabled a completely new class of web apps and led to a surge of interest in JavaScript.

That may have contributed to TC39 resuming work on ES4 in fall 2005. They based ES4 on ES3, the interim ES4 report and experiences with ActionScript and JScript.NET.

There were now two groups working on future ECMAScript versions:

- ECMAScript 4 was designed by Adobe, Mozilla, Opera, and Google and was a massive upgrade. Its planned feature sets included:
  - Programming in the large (classes, interfaces, namespaces, packages, program units, optional type annotations, and optional static type checking and verification)
  - Evolutionary programming and scripting (structural types, duck typing, type definitions, and multimethods)
  - Data structure construction (parameterized types, getters and setters, and meta-level methods)
  - Control abstractions (proper tail calls, iterators, and generators)
  - Introspection (type meta-objects and stack marks)
- ECMAScript 3.1 was designed by Microsoft and Yahoo. It was planned as a subset of ES4 and an incremental upgrade of ECMAScript 3, with bug fixes and minor new features. ECMAScript 3.1 eventually became ECMAScript 5.

The two groups disagreed on the future of JavaScript and tensions between them continued to increase.

### 1.7.3 ECMAScript Harmony

At the end of July 2008, there was a TC39 meeting in Oslo, whose outcome was [described](https://mail.mozilla.org/pipermail/es-discuss/2008-August/006837.html) as follows by Brendan Eich:

> It’s no secret that the JavaScript standards body, Ecma’s Technical Committee 39, has been split for over a year, with some members favoring ES4 […] and others advocating ES3.1 […]. Now, I’m happy to report, the split is over.

The agreement that was worked out at the meeting consisted of four points:

1. Develop an incremental update of ECMAScript (which became ECMAScript 5).
2. Develop a major new release, which was to be more modest than ECMAScript 4, but much larger in scope than the version after ECMAScript 3. This version was code-named _Harmony_, due to the nature of the meeting in which it was conceived.
3. Features from ECMAScript 4 that would be dropped: packages, namespaces, early binding.
4. Other ideas were to be developed in consensus with all of TC39.

Thus: The ES4 group agreed to make Harmony less radical than ES4, the rest of TC39 agreed to keep moving things forward.

The next versions of ECMAScript are:

- **ECMAScript 5 (December 2009).** This is the version of ECMAScript that most browsers support today. It brings several enhancements to the standard library and updated language semantics via a _strict mode_.
- **ECMAScript 5.1 (June 2011).** ES5 was submitted as an ISO standard. In the process, minor corrections were made. ES5.1 contains those corrections. It is the same text as ISO/IEC 16262:2011.
- **ECMAScript 6 (June 2015).** This version went through several name changes:
  - ECMAScript Harmony: was the initial code name for JavaScript improvements after ECMAScript 5.
  - ECMAScript.next: It became apparent that the plans for Harmony were too ambitious for a single version, so its features were split into two groups: The first group of features had highest priority and was to become the next version after ES5. The code name of that version was ECMAScript.next, to avoid prematurely comitting to a version number, which proved problematic with ES4. The second group of features had time until after ECMAScript.next.
  - ECMAScript 6: As ECMAScript.next matured, its code name was dropped and everybody started to call it ECMAScript 6.
  - ECMAScript 2015: In late 2014, TC39 decided to change the official name of ECMAScript 6 to ECMAScript 2015, in light of upcoming yearly spec releases. However, given how established the name “ECMAScript 6” already is and how late TC39 changed their minds, I expect that that’s how everybody will continue to refer to that version.
- **ECMAScript 2016** was previously called ECMAScript 7. Starting with ES2016, the language standard will see smaller yearly releases.

[Source](https://johnresig.com/blog/ecmascript-harmony/)
