# markdown-it-eleventy-img
A [markdown-it](https://github.com/markdown-it/markdown-it) plugin that processes images through the [eleventy-img](https://github.com/11ty/eleventy-img) plugin. Can be used in any projects that uses markdown-it.

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
With [Eleventy](https://www.11ty.dev/), use Eleventy [config API](https://www.11ty.dev/docs/config/) `setLibrary` method.
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
Will be rendered as: 

```html
<p><picture><source type="image/webp" srcset="/img/wtdfPs-yjZ-2048.webp 2048w"><img alt="Image alt" title="Title text!" src="/img/wtdfPs-yjZ-2048.jpeg" width="2048" height="1463"></picture></p>
```
Override eleventy-img default and attributes to the image output by adding an options object.

### Using options object

The options object may contain up to two property objects: `options` and `attributes`. `options` can be used to override eleventy-img specific options and `attributes` can be used to add attributes to the image output. The `alt`, the `src` and the optional `title` attributes are taken from the markdown token: `![alt](./source.ext "Title")`. Here's an exemple of using the options object:

```js
// Code above removed for clarity.

.use(markdownItEleventyImg, {
  options: {
    widths: [800, 500, 300],
    urlPath: "/images/",
    outputDir: path.join("_site", "images"),
    formats: ["avif", "webp", "jpeg"]
  },
  attributes: {
    class: "markdown-image",
    decoding: "async",
    // If you use multiple widths,
    // don't forget to add a `sizes` attribute.
    sizes: "100vw"
  }
});
```
With these options, the image `![Image alt](./img/my-image.jpg "Title text!")`, would be rendered:

```html
<p><picture><source type="image/avif" srcset="/images/wtdfPs-yjZ-300.avif 300w, /images/wtdfPs-yjZ-500.avif 500w, /images/wtdfPs-yjZ-800.avif 800w" sizes="100vw"><source type="image/webp" srcset="/images/wtdfPs-yjZ-300.webp 300w, /images/wtdfPs-yjZ-500.webp 500w, /images/wtdfPs-yjZ-800.webp 800w" sizes="100vw"><source type="image/jpeg" srcset="/images/wtdfPs-yjZ-300.jpeg 300w, /images/wtdfPs-yjZ-500.jpeg 500w, /images/wtdfPs-yjZ-800.jpeg 800w" sizes="100vw"><img alt="Image alt" title="Title text!" class="markdown-image" decoding="async" src="/images/wtdfPs-yjZ-300.jpeg" width="800" height="571"></picture></p>
```

### Using lazy loading

Control how images are loaded with the [loading attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading). To do so, add a `%lazy%` flag at the begining of title like so: `![Image alt](./img/my-image.jpg "%lazy% Title text!")`. This will add a `loading="lazy"` to the output `img` markup. The `%lazy%` flag is case insensitive so `%LAZY%` or `%LaZy%` would also work. The title string containing the flag and the extracted title is trimmed so any spaces before or after the title or in between the flag and the title will be removed. That means `"  %lazy%  Title text "` will trigger the lazy attribute and return the title `"Title text"`. 

## Motivation

Coming soon!

## Allignements

Coming soon!