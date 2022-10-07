const Image = require("@11ty/eleventy-img");
const logWarningFor = require("./utilities/warnings");
const { remove } = require("./utilities/remove-key-from");
const generateAttrsObject = require("./utilities/generate-attrs-object");
const { typeObjectError, typeFunctionError } = require("./utilities/errors");
const { propertiesFrom } = require("./utilities/lower-case-trim-object");

const path = require("path");

/**
 * 
 * @param {MarkdownIt} md The markdown-it object
 * @param {*} imgOptions Overrides eleventy-img specific options.
 * @param {*} globalAttributes Adds attributes to the image output.
 * @param {Function} renderImage Lets you render custom markup and do almost everything you like with your markdown images.
 * @param {boolean} eleventyResolveToProjectRoot If set to false, will check for images in directory relative to the file where the image is reference. Defaults to true.
 */
module.exports = function markdownItEleventyImg(md, {
  imgOptions = {},
  globalAttributes = {},
  renderImage,
  eleventyResolveToProjectRoot = true
} = {}) {
  typeObjectError(imgOptions, "imgOptions");
  typeObjectError(globalAttributes, "globalAttributes");
  typeFunctionError(renderImage, "renderImage");

  const normalizedGlobalAttributes = propertiesFrom(globalAttributes).lowerCased().trimmed().object();

  logWarningFor(normalizedGlobalAttributes);

  md.renderer.rules.image  = (tokens, index, rendererOptions, env, renderer) => {

    const token = tokens[index];

    const normalizedTokenAttributes = generateAttrsObject(token).addContentTo("alt").attrs;

    const src = normalizedTokenAttributes.src;
    if(Image.Util.isRemoteUrl(normalizedTokenAttributes.src) && eleventyResolveToProjectRoot == false) {
      path.join(path.dirname(env.page.inputPath), normalizedTokenAttributes.src);
    }

    const normalizedTokenAttributesWithoutSrc = remove("src").from(normalizedTokenAttributes);

    const imageAttributes = { ...normalizedGlobalAttributes, ...normalizedTokenAttributesWithoutSrc };

    if(renderImage) {
      const image = [ Image, imgOptions ];
      const attributes = [ src, imageAttributes ];
      return renderImage(image, attributes);
    }

    if(Image.Util.isRemoteUrl(src)) {
      token.attrs[token.attrIndex("alt")][1] = token.content;
      return renderer.renderToken(tokens, index, rendererOptions);
    }
    
    Image(src, imgOptions);

    const metadata = Image.statsSync(src, imgOptions);
    const imageMarkup = Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: "inline"
    });
    
    return imageMarkup;
  };
};