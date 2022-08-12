const test = require("ava");
const md = require("markdown-it")();
const markdownItEleventyImg = require("./");
const logWarningFor = require("./utilities/warnings");
const fs = require("fs");
const path = require("path");
const Eleventy = require("@11ty/eleventy");
const eleventyInput = "test-eleventy";
const eleventyOutput = "_site";

test("Log warning for alt", t => {
  const globalAttributes = {
    alt: ""
  }

  t.is(logWarningFor(globalAttributes), "WARNING: Setting alt in configuration will have no effect on the markdown image output. The alt attribute has to be set on the markdown image token.");
});

test("Log warning for title", t => {
  const globalAttributes = {
    title: ""
  }

  t.is(logWarningFor(globalAttributes), "WARNING: Setting title in configuration will have no effect on the markdown image output. The title attribute has to be set on the markdown image token.");
});

test("Log warning for src", t => {
  const globalAttributes = {
    src: ""
  }

  t.is(logWarningFor(globalAttributes), "WARNING: Setting src in configuration will have no effect on the markdown image output. The src attribute has to be set on the markdown image token.");
});

test("typeObjectError for imgOptions (string)", t => {
  t.throws(() => {
    md.use(markdownItEleventyImg, {
      imgOptions: ""
    });
  }, {message: "Markdown-it-eleventy-img: `imgOptions` needs to be an `object`."});
});

test("typeObjectError for imgOptions (number)", t => {
  t.throws(() => {
    md.use(markdownItEleventyImg, {
      imgOptions: 1
    });
  }, {message: "Markdown-it-eleventy-img: `imgOptions` needs to be an `object`."});
});

test("typeObjectError for imgOptions (array)", t => {
  t.throws(() => {
    md.use(markdownItEleventyImg, {
      imgOptions: []
    });
  }, {message: "Markdown-it-eleventy-img: `imgOptions` needs to be an `object`."});
});

test("typeObjectError for imgOptions (null)", t => {
  t.throws(() => {
    md.use(markdownItEleventyImg, {
      imgOptions: null
    });
  }, {message: "Markdown-it-eleventy-img: `imgOptions` needs to be an `object`."});
});

test("typeObjectError for imgOptions (undefined not throwing)", t => {
  t.notThrows(() => {
    md.use(markdownItEleventyImg, {
      imgOptions: undefined
    });
  });
});

test.skip("markdownItEleventyImg with markdown-it (default no-config)", t => {
  const result = md.use(markdownItEleventyImg).render('![Alt diplomees2021](./assets/images/diplomees2021.jpg "Title diplomees2021")');

  t.is(result, '<p><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img alt="Alt diplomees2021" title="Title diplomees2021" src="/img/pRWAdktn3m-2048.jpeg" width="2048" height="1463"></picture></p>\n');
});

test.serial("markdownItEleventyImg with Eleventy (default no-config)", async t => {
  let elev = new Eleventy(eleventyInput, eleventyOutput, {
    config(config) {
      config.setLibrary("md", md.use(markdownItEleventyImg));
    }
  });
  let json = await elev.toJSON();
  
  t.is(json[0].content, '<p><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img alt="Alt diplomees2021" title="Title diplomees2021" src="/img/pRWAdktn3m-2048.jpeg" width="2048" height="1463"></picture></p>\n');
});

test.serial("markdownItEleventyImg with Eleventy with imgOptions and globalAttributes (dryrun)", async t => {
  let elev = new Eleventy(eleventyInput, eleventyOutput, {
    config(config) {
      config.setLibrary("md", md.use(markdownItEleventyImg, {
        imgOptions: {
          widths: [800, 500, 300],
          urlPath: "/images/",
          outputDir: path.join("_site", "images"),
          formats: ["avif", "webp", "jpeg"],
          dryRun: true
        },
        globalAttributes: {
          class: "markdown-image",
          decoding: "async",
          sizes: "100vw"
        }
      }));
    }
  });
  let json = await elev.toJSON();
  
  t.is(json[0].content, '<p><picture><source type="image/avif" srcset="/images/pRWAdktn3m-300.avif 300w, /images/pRWAdktn3m-500.avif 500w, /images/pRWAdktn3m-800.avif 800w" sizes="100vw"><source type="image/webp" srcset="/images/pRWAdktn3m-300.webp 300w, /images/pRWAdktn3m-500.webp 500w, /images/pRWAdktn3m-800.webp 800w" sizes="100vw"><source type="image/jpeg" srcset="/images/pRWAdktn3m-300.jpeg 300w, /images/pRWAdktn3m-500.jpeg 500w, /images/pRWAdktn3m-800.jpeg 800w" sizes="100vw"><img class="markdown-image" decoding="async" alt="Alt diplomees2021" title="Title diplomees2021" src="/images/pRWAdktn3m-300.jpeg" width="800" height="571"></picture></p>\n');
});

test.after("cleanup", t => {
  const imgDir = "img";

  if(fs.existsSync(imgDir)) {
    fs.rmSync(imgDir, { recursive: true });
  }
});

/**
 * config.setLibrary('md', markdownIt ({
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
      formats: ["avif", "webp", "jpeg"],
      dryRun: true
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
 */