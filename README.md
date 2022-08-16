# markdown-it-eleventy-img
A [markdown-it](https://github.com/markdown-it/markdown-it) plugin that process images through the [eleventy-img](https://github.com/11ty/eleventy-img) plugin. Can be used in any projects that use markdown-it. Fully compatible with the [Eleventy](https://www.11ty.dev/) static site generator.

[![NPM version badge.](https://img.shields.io/npm/v/markdown-it-eleventy-img)](https://github.com/solution-loisir/markdown-it-eleventy-img/releases)
[![GitHub issues badge.](https://img.shields.io/github/issues/solution-loisir/markdown-it-eleventy-img)](https://github.com/solution-loisir/markdown-it-eleventy-img/issues)
[![NPM license badge.](https://img.shields.io/npm/l/markdown-it-eleventy-img)](https://github.com/solution-loisir/markdown-it-eleventy-img/blob/master/LICENSE)

## Status

This is pre-release software. There might still be API changes. I'm pretty much developing this plugin in the open and I'm learning buckets! 

Use at your own risk, but feel free to get in touch if you have questions, a comment or want to talk about your experience as a user.

## Requirements

Same as [eleventy-img](https://github.com/11ty/eleventy-img). Was tested with markdown-it `v9.0.0` and Eleventy `v1.0.1`.

## Installation

```
npm install --save-dev markdown-it-eleventy-img
```

## Usage

This plugin is zero-config by default and can be use as a regular [markdown-it plugin](https://github.com/markdown-it/markdown-it#plugins-load).

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

Will output:

```html
<p><picture><source type="image/webp" srcset="/img/wtdfPs-yjZ-2048.webp 2048w"><img alt="Image alt" title="Title text!" src="/img/wtdfPs-yjZ-2048.jpeg" width="2048" height="1463"></picture></p>
```
By default, images are rendered using the `generateHTML` function from the eleventy-img plugin with the `whitespaceMode` "to strip the whitespace from the output of the `<picture>` element (a must-have for use in markdown files)" ([reference](https://www.11ty.dev/docs/plugins/image/#use-this-in-your-templates)).

You can add an options object to override eleventy-img defaults and attributes.

## Using options

The options object may contain up to three properties: 
* `imgOptions` (object).
Overrides eleventy-img specific options.
* `globalAttributes` (object).
Adds attributes to the image output.
* `renderImage` (function).
Lets you render custom markup and do almost everything you like with your markdown images (see [Custom image rendering](#custom-image-rendering)).

Here's an exemple of using the options object:

```js
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
The `alt`, the `src`, and the optional `title` attributes are taken from the markdown token: `![alt](./source.ext "Title")`. 

Setting `alt`, `src` or `title` properties in `globalAttributes` will have no effect on the markdown image output. These attributes have to be set on the markdown image token instead.

A warning will be logged in the console if any of these properties are set in `globalAttributes`.

## Custom image rendering

You may use the `renderImage` method to customize the output or to add logic to your image rendering. This function is returned inside of the image renderer so any string returned by `renderImage` will render the markup for every image tokens.

```js
renderImage(image, attributes) {
  const [ src, attrs ] = attributes;
  const alt = attrs.alt;
    
  return `<img src="${src}" alt="${alt}">`;
}
```

`renderImage` takes two parameters and each one are tuples.

```js
renderImage(image, attributes) {
  const [ Image, options ] = image;
  const [ src, attrs ] = attributes;

  // ...
}
```
We separate the `src` form the rest of the attributes to facilitate the use of the `Image` class. If you need to, it is simple to reunite.

```js
const [ src, attrs ] = attributes;
const allAttributes = { ...attrs, src }
```

Here's an exemple of adding a `<figure>` parent and an optional `<figcaption>` to the image in [Eleventy](https://www.11ty.dev/).

```js
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
> Note that you have to use eleventy-img [synchronous API](https://www.11ty.dev/docs/plugins/image/#synchronous-shortcode) inside `renderImage`. Unfortunately, markdown-it plugins doesn't support async code. It's good to know that even in the sync API, the images are generated asychronously. Got to 😍 11ty!

## Use with markdown-it-attrs

Starting with `v0.3.0`, markdown-it-eleventy-img is fully compatible with [markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs). Setting attributes with markdown-it-attrs will be passed to the image output. Same attributes will be overridden. The attribute set on the token will prevail over `globalAttributes`. 

## Motivation

I've seen it asked [here](https://github.com/AleksandrHovhannisyan/aleksandrhovhannisyan.com/issues/118#issuecomment-1190703611) and [there](https://github.com/11ty/eleventy-img/issues/90): can I use the eleventy-img plugin with markdown token? I thought it was a good challenge and I ended-up publishing my work.

## Alignements

markdown-it-eleventy-img tries to follow as much as possible the [markdown philosophy](https://daringfireball.net/projects/markdown/syntax#philosophy). The idea is to keep simplicity while generating responsive image format in markdown. With markdown-it-eleventy-img, you author images in markdown the same way as usual.

Also, the aim is to stay coherent with [eleventy-img](https://www.11ty.dev/docs/plugins/image/) defaults while allowing users to use the full feature set (almost). So if your familiar with the eleventy-img plugin, there should be no surprises. 

markdown-it-eleventy-img is not a replacement for an Eleventy [shortcode](https://www.11ty.dev/docs/shortcodes/). Shortcodes will give more power and control. On the other hand, markdown will trade control for easiness of reading and writing. 

[Admittedly, it’s fairly difficult to devise a “natural” syntax for placing images into a plain text document format.](https://daringfireball.net/projects/markdown/syntax#img) That beiing said, it's probably nicer to use markdown image syntax to include an image in a blog post than to use a shortcode. So markdown-it-eleventy-img is mainly an ergonomic solution for using eleventy-img plugin with the markdown image synthax.