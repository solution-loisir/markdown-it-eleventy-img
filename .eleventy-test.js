module.exports = (config) => {
  config.setLibrary("md", md.use(markdownItEleventyImg, {
    imgOptions: {
      dryRun: true
    }
  }));
};