/**
 * @typedef TokenAttributesObject
 * @property {string} src
 * @property {string} alt
 * @property {string} [title]
 * @property {string} [key]
 */

/**
 * @typedef {import("@11ty/eleventy-img").ImageOptions} ImageOptions
 * @link https://github.com/11ty/eleventy-img/blob/d9723c59c94b93cfc05efbffd61efef7d19906e8/img.js#L17
 */

/**
 * @typedef GlobalAttributes
 * @property {string} [key]
 */

/**
 * @typedef markdownItEleventyImgOptions
 * @property {ImageOptions} imgOptions Overrides eleventy-img specific options.
 * @property {GlobalAttributes} globalAttributes Adds attributes to the image output.
 * @property {Function} renderImage Lets you render custom markup and do almost everything you like with your markdown images.
 * @property {Function} resolvePath Function that will be used to resolve paths for images in markdown. Receives image path string and `env` as parameters. Default resolves to CWD.
 */