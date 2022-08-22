module.exports = target => {
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