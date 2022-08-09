module.exports = (target) => {
  Object.keys(target).forEach(property => {
    switch(property) {
      case "alt":
      case "title":
      case "src":
        console.warn(`WARNING: Setting ${property} in configuration will have no effect on the markdown image output. The ${property} attribute has to be set on the markdown image token.`);
    }
  });
}