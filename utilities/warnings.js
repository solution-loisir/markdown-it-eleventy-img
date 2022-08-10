module.exports = target => {
  let warning = "";

  Object.keys(target).forEach(property => {
    switch(property) {
      case "alt":
      case "title":
      case "src":
        const warningMessage = `WARNING: Setting ${property} in configuration will have no effect on the markdown image output. The ${property} attribute has to be set on the markdown image token.`;
        console.warn(warningMessage);
        warning = warningMessage;
    }
  });

  return warning;
}