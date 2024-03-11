const Image = require("@11ty/eleventy-img");
const { warnings } = require("./utilities/warnings");
const { remove } = require("./utilities/remove-key-from");
const generateAttrsObject = require("./utilities/generate-attrs-object");
const { typeObjectError, typeFunctionError } = require("./utilities/errors");
const { propertiesFrom } = require("./utilities/lower-case-trim-object");

/** @typedef {require("type.js").markdownItEleventyImgOptions} markdownItEleventyImgOptions */
/**
 * @param {MarkdownIt} md The markdown-it object.
 * @param {markdownItEleventyImgOptions} [markdownItEleventyImgOptions] Optional options object.
 */
module.exports = function markdownItEleventyImg(md, {
  imgOptions = {},
  globalAttributes = {},
  renderImage,
  resolvePath
} = {}) {

  typeObjectError(imgOptions, "imgOptions");
  typeObjectError(globalAttributes, "globalAttributes");
  typeFunctionError(renderImage, "renderImage");
  typeFunctionError(resolvePath, "resolvePath");

  const normalizedGlobalAttributes = propertiesFrom(globalAttributes).lowerCased().trimmed().object();

  warnings(normalizedGlobalAttributes);

  /**
   * Overrides MarkdownIt image renderer.
   * @link https://markdown-it.github.io/markdown-it/#Renderer.prototype.rules
   * @param {Object[]} tokens List of tokens.
   * @link https://markdown-it.github.io/markdown-it/#Token
   * @param {number} index Token index to render.
   * @param {Object} rendererOptions Parameters of parser instance.
   * @param {Object} env Additional data from parsed input.
   * @param {Object} renderer Reference to the renderer itself.
   * @returns {string}
   */
  md.renderer.rules.image  = (tokens, index, rendererOptions, env, renderer) => {

    const token = tokens[index];

    // Passing remote sources through Markdown-it default renderer.
    if(Image.Util.isRemoteUrl(token.attrGet("src"))) {
      token.attrs[token.attrIndex("alt")][1] = token.content;
      return renderer.renderToken(tokens, index, rendererOptions);
    }

    const normalizedTokenAttributes = generateAttrsObject(token).addContentTo("alt").attrs;

    const src = (resolvePath) ? resolvePath(normalizedTokenAttributes.src, env) : normalizedTokenAttributes.src;

    const normalizedTokenAttributesWithoutSrc = remove("src").from(normalizedTokenAttributes);

    const imageAttributes = { ...normalizedGlobalAttributes, ...normalizedTokenAttributesWithoutSrc };

    if(renderImage) {
      const image = [ Image, imgOptions ];
      const attributes = [ src, imageAttributes ];
      return renderImage(image, attributes);
    }
    
    Image(src, imgOptions);

    const metadata = Image.statsSync(src, imgOptions);
    const imageMarkup = Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: "inline"
    });
    
    return imageMarkup;
  };
};