/** @typedef {require("../types.js").GlobalAttributes} GlobalAttributes */

/**
 * Logs a warning in the console using `console.warn()`. Is triggered by the presence of `alt` or `src` property in the `target` object argument.
 * @param {GlobalAttributes} target 
 * @returns {string} The warning message.
 */

const warnings = (target) => {
  let warning = "";

  Object.keys(target).forEach(property => {
    switch(property) {
      case "alt":
      case "src":
        warning = `Markdown-it-eleventy-img WARNING: Setting \`${property}\` in \`globalAttributes\` will have no effect on the markdown image output. The \`${property}\` attribute has to be set on the markdown image token.`;
        console.warn(warning);
        break;
    }
  });

  return warning;
};

module.exports = {
  warnings
};