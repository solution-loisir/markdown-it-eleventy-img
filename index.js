const Image = require("@11ty/eleventy-img");
const findLazyFlag = require("./utilities/find-lazy-flag");
const logWarningForAttributes = require("./utilities/warnings");


module.exports = function markdownItEleventyImg(md, {
  options = {},
  attributes = {}
} = {}) {

  logWarningForAttributes(attributes);

  md.renderer.rules.image  = (tokens, index, rendererOptions, env, renderer) => {

    const token = tokens[index];

    const src = token.attrGet("src");
    const title = token.attrGet("title") || "";
    const { isLazy, titleText } = findLazyFlag(title);

    const defaultAttributes = {
      alt: token.content
    }
    if(titleText) {
      defaultAttributes.title = titleText;
    }
    if(isLazy) {
      defaultAttributes.loading = "lazy";
    }

    const imageAttributes = { ...defaultAttributes, ...attributes }
    
    Image(src, options);

    const metadata = Image.statsSync(src, options);
    const imageMarkup = Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: "inline"
    });
    
    return imageMarkup;
  }
}