module.exports = optionsObject => {
  if(optionsObject.alt) console.warn("WARNING: Setting `alt` in the attributes object will override the alt attribute on all markdown images.");

  if(optionsObject.title) console.warn("WARNING: Setting `title` in the attributes object will override the title attribute on all markdown images.");

  if(optionsObject.src) console.warn("WARNING: Setting `src` in the attributes object as no effect on markdown output images.");
}