const markdownIt = require("markdown-it");
const markdownItEleventyImg = require("./");
const path = require("path");

const markdownItAttrs = require('markdown-it-attrs');

module.exports = config => {

  config.setLibrary('md', markdownIt ({
    html: true,
    breaks: true,
    linkify: true
  })
  .use(markdownItAttrs)
  .use(markdownItEleventyImg, {
    imgOptions: {
      widths: [800, 500, 300],
      urlPath: "/images/",
      outputDir: path.join("_site", "images"),
      formats: ["avif", "webp", "jpeg"]
    },
    globalAttributes: {
      class: "markdown-image",
      decoding: "async",
      sizes: "100vw",
      alt: "Uniform alt",
      title: "Uniform title"
    },
    renderImage(image, attributes) {
      const [ Image, options ] = image;
      const [ src, attrs ] = attributes;

      Image(src, options);

      const metadata = Image.statsSync(src, options);
      const imageMarkup = Image.generateHTML(metadata, attrs, {
        whitespaceMode: "inline"
      });
    
      return `<figure>${imageMarkup}${attrs.title ? `<figcaption>${attrs.title}</figcaption>` : ""}</figure>`;
    }
  }));

  return {
    dir: {
        input: 'eleventy',
        output: '_site'
    },
    pathPrefix: '/',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    templateFormats: ['html', 'md']
}
}
