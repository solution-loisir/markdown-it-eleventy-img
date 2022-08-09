# markdown-it-eleventy-img
A [markdown-it](https://github.com/markdown-it/markdown-it) plugin that processes images through the [eleventy-img](https://github.com/11ty/eleventy-img) plugin. Can be used in any projects that uses markdown-it.

## Status

This is pre-release software. There might still be API changes. I'm pretty much developing this plugin in the open and I'm learning buckets! 

Use at your own risk, but feel free to get in touch if you have questions, a comment or want to talk about your experience as a user.

## Requirements

Same as [eleventy-img](https://github.com/11ty/eleventy-img).

## Installation

```
npm install --save-dev markdown-it-eleventy-img
```

## Usage

After installing, this plugin can be use as a regular [markdown-it plugin](https://github.com/markdown-it/markdown-it#plugins-load).

```js
const md = require('markdown-it')()
  .use(require("markdown-it-eleventy-img"));
```
With [Eleventy](https://www.11ty.dev/) (11ty), use the [config API](https://www.11ty.dev/docs/config/) `setLibrary` method.
```js
// .eleventy.js (or your config file.)

const markdownIt = require('markdown-it');
const markdownItEleventyImg = require("markdown-it-eleventy-img");

module.exports = function(config) {
  config.setLibrary('md', markdownIt ({
    html: true,
    breaks: true,
    linkify: true
  })
  .use(markdownItEleventyImg);
}
```
Using markdown-it-eleventy-img without options will utilize eleventy-img [default options](https://www.11ty.dev/docs/plugins/image/#usage) which are:

* `widths: [null]`
* `formats: ["webp", "jpeg"]`
* `urlPath: "/img/"`
* `outputDir: "./img/"`

So using:

```md
<!-- index.md -->

![Image alt](./img/my-image.jpg "Title text!")
```
Will be rendered by default using the [generateHTML](https://www.11ty.dev/docs/plugins/image/#use-this-in-your-templates) function from eleventy-img: 

```html
<p><picture><source type="image/webp" srcset="/img/wtdfPs-yjZ-2048.webp 2048w"><img alt="Image alt" title="Title text!" src="/img/wtdfPs-yjZ-2048.jpeg" width="2048" height="1463"></picture></p>
```
Override eleventy-img default and attributes to the image output by adding an options object.

## Using options

The options object may contain up to three properties: `imgOptions`, `globalAttributes` and the `renderImage` method. Use `imgOptions` to override eleventy-img specific options. `globalAttributes` can be used to add attributes to the image output. The `renderImage` function will let you render custom markup and do almost everything you like with your markdown images (see [Custom image rendering](#custom-image-rendering)).

The `alt`, the `src`, the optional `title` and `loading` (see [Using lazy loading](#using-lazy-loading)) attributes are taken from the markdown token: `![alt](./source.ext "Title")`. 

Setting `alt`, `title`, `src` or `loading` properties in the `attributes` config object will have no effect on the markdown image output. These attributes have to be set on the markdown image token instead.

A warning will be logged in the console if any of these properties are set in the `globalAttributes` config object.

Here's an exemple of using the options object:

```js
// ...

.use(markdownItEleventyImg, {
  imgOptions: {
    widths: [800, 500, 300],
    urlPath: "/images/",
    outputDir: path.join("_site", "images"),
    formats: ["avif", "webp", "jpeg"]
  },
  globalAttributes: {
    class: "markdown-image",
    decoding: "async",
    // If you use multiple widths,
    // don't forget to add a `sizes` attribute.
    sizes: "100vw"
  },
  renderImage(image, attributes) {
    // ...
    return imageMarkup // -> string
  }
});
```
With these options, the image `![Image alt](./img/my-image.jpg "Title text!")`, would be rendered as:

```html
<p><picture><source type="image/avif" srcset="/images/wtdfPs-yjZ-300.avif 300w, /images/wtdfPs-yjZ-500.avif 500w, /images/wtdfPs-yjZ-800.avif 800w" sizes="100vw"><source type="image/webp" srcset="/images/wtdfPs-yjZ-300.webp 300w, /images/wtdfPs-yjZ-500.webp 500w, /images/wtdfPs-yjZ-800.webp 800w" sizes="100vw"><source type="image/jpeg" srcset="/images/wtdfPs-yjZ-300.jpeg 300w, /images/wtdfPs-yjZ-500.jpeg 500w, /images/wtdfPs-yjZ-800.jpeg 800w" sizes="100vw"><img alt="Image alt" title="Title text!" class="markdown-image" decoding="async" src="/images/wtdfPs-yjZ-300.jpeg" width="800" height="571"></picture></p>
```
## Custom image rendering

You may use the `renderImage` method (a callback function) to customize the output or to add logic in the process. This function is returned inside of the image renderer. Any string returned by `renderImage` will output the markup for every image token. 

`renderImage` takes two parameters and each one are tuples. The first parameter as the `Image` class from the eleventy-img plugin and the `imgOptions` config object. The second parameter as the `src` attribute and the rest of the `globalAttributes` in second position. We separate the `src` form the rest of the attributes to facilitate the use of the `Image` class. If you need to, it is simple to reunite.

```js
const [ src, attrs ] = attributes;

const allAttributes = { ...attrs, src }
```

Here's an exemple of adding a `<figure>` parent and an optional `<figcaption>` to the image in [Eleventy](https://www.11ty.dev/).

```js
// ...

renderImage(image, attributes) {
  const [ Image, options ] = image;
  const [ src, attrs ] = attributes;

  Image(src, options);

  const metadata = Image.statsSync(src, options);
  const imageMarkup = Image.generateHTML(metadata, attrs, {
    whitespaceMode: "inline"
  });
    
  return `<figure>${imageMarkup}${attrs.title ? `<figcaption>${attrs.title}</figcaption>` : ""}</figure>`;
}
```
Note that you have to use eleventy-img [synchronous API](https://www.11ty.dev/docs/plugins/image/#synchronous-shortcode) inside `renderImage`. Unfortunately, markdown-it plugins doesn't support async code. It's good to know that even in the sync API, the images are generated asychronously. Got to 😍 11ty!

## Using lazy loading

Control how images are loaded with the [loading attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading). To do so, add a `%lazy%` flag at the begining of title like so: `![Image alt](./img/my-image.jpg "%lazy% Title text!")`. This will add a `loading="lazy"` to the output `img` markup. The `%lazy%` flag is case insensitive so `%LAZY%` or `%LaZy%` would also work. The title string containing the flag and the extracted title is trimmed so any spaces before or after the title or in between the flag and the title will be removed. That means `"  %lazy%  Title text "` will trigger the lazy attribute and return the title `"Title text"`.

### Use with markdown-it-attrs

Starting with `v0.3.0`, markdown-it-eleventy-img is fully compatible with [markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs). Setting attributes with markdown-it-attrs will be passed to the image output. Same attributes will be overridden. 

## Motivation

Coming soon!

## Alignements

Coming soon!