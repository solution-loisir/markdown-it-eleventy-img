const test = require("ava");
const md = require("markdown-it")();
const markdownItAttrs = require('markdown-it-attrs');
const implicitFigures = require("markdown-it-implicit-figures");
const markdownItEleventyImg = require("./");
const logWarningFor = require("./utilities/warnings");
const generateAttrsObject = require("./utilities/generate-attrs-object");
const { remove } = require("./utilities/remove-key-from");
const fs = require("fs");
const path = require("path");
const Eleventy = require("@11ty/eleventy");
const eleventyInput = "test-eleventy";
const eleventyOutput = "_site";
const imageDiplomees2021 = '![Alt diplomees2021](./assets/images/diplomees2021.jpg "Title diplomees2021")';
const imagemarkdownItAttrs = '![Alt diplomees2021](./assets/images/diplomees2021.jpg "Title diplomees2021"){loading=lazy}';
const imgWithoutTitle = '![Alt diplomees2021](./assets/images/diplomees2021.jpg)';
const imgWithEmptyTitle = '![Alt diplomees2021](./assets/images/diplomees2021.jpg "")';
const remoteSrc = "https://apod.nasa.gov/apod/image/2208/StargateMilkyWay_Oudoux_1800.jpg"
const remoteImage = `![](${remoteSrc})`;

test("Empty string title is undefined", t => {
  md.use(markdownItEleventyImg, {
    imgOptions: {
      dryRun: true
    },
    renderImage(image, attributes) {
      const [src, attrs] = attributes;
      t.is(attrs.title, undefined);
    }
  })
  .render(imgWithEmptyTitle);
});

test("Image without title (title is undefined)", t => {
  md.use(markdownItEleventyImg, {
    imgOptions: {
      dryRun: true
    },
    renderImage(image, attributes) {
      const [src, attrs] = attributes;
      t.is(attrs.title, undefined);
    }
  })
  .render(imgWithoutTitle);
});

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

test("generate-attrs-object", t => {
  const tokens = md.parseInline(imageDiplomees2021);
  const token = tokens[0].children[0];
  
  const tokenAttributes = generateAttrsObject(token).attrs;

  t.deepEqual(tokenAttributes, {
    src: "./assets/images/diplomees2021.jpg",
    alt: "",
    title: "Title diplomees2021"
  });

  const tokenAttributesWithAlt = generateAttrsObject(token).addContentTo("alt").attrs;

  t.deepEqual(tokenAttributesWithAlt, {
    src: "./assets/images/diplomees2021.jpg",
    alt: "Alt diplomees2021",
    title: "Title diplomees2021"
  });
});

test("remove-key-from", t => {
  const tokenAttributes = {
    src: "./assets/images/diplomees2021.jpg",
    alt: "Alt diplomees2021",
    title: "Title diplomees2021"
  }

  const tokenAttributesWithoutSrc = remove("src").from(tokenAttributes);

  t.deepEqual(tokenAttributesWithoutSrc, {
    alt: "Alt diplomees2021",
    title: "Title diplomees2021"
  });
});

test("markdown-it-attrs pass down attributes", t => {
  const result = md
  .use(markdownItEleventyImg)
  .use(markdownItAttrs)
  .render(imagemarkdownItAttrs);

  t.is(result, '<p><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img alt="Alt diplomees2021" title="Title diplomees2021" loading="lazy" src="/img/pRWAdktn3m-2048.jpeg" width="2048" height="1463"></picture></p>\n');
});

test("markdown-it-attrs pass overrides attributes", t => {
  const result = md
  .use(markdownItEleventyImg, {
    globalAttributes: {
      loading: "eager"
    }
  })
  .use(markdownItAttrs)
  .render(imagemarkdownItAttrs);

  t.is(result, '<p><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img loading="lazy" alt="Alt diplomees2021" title="Title diplomees2021" src="/img/pRWAdktn3m-2048.jpeg" width="2048" height="1463"></picture></p>\n');
});

test.serial("markdownItEleventyImg with markdown-it (default no-config)", t => {
  const result = md.use(markdownItEleventyImg).render(imageDiplomees2021);

  t.is(result, '<p><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img alt="Alt diplomees2021" title="Title diplomees2021" src="/img/pRWAdktn3m-2048.jpeg" width="2048" height="1463"></picture></p>\n');
});

test.serial("markdownItEleventyImg with markdown-it with imgOptions and globalAttributes (dryrun)", t => {
  const result = md.use(markdownItEleventyImg, {
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
  }).render(imageDiplomees2021);

  t.is(result, '<p><picture><source type="image/avif" srcset="/images/pRWAdktn3m-300.avif 300w, /images/pRWAdktn3m-500.avif 500w, /images/pRWAdktn3m-800.avif 800w" sizes="100vw"><source type="image/webp" srcset="/images/pRWAdktn3m-300.webp 300w, /images/pRWAdktn3m-500.webp 500w, /images/pRWAdktn3m-800.webp 800w" sizes="100vw"><source type="image/jpeg" srcset="/images/pRWAdktn3m-300.jpeg 300w, /images/pRWAdktn3m-500.jpeg 500w, /images/pRWAdktn3m-800.jpeg 800w" sizes="100vw"><img class="markdown-image" decoding="async" alt="Alt diplomees2021" title="Title diplomees2021" src="/images/pRWAdktn3m-300.jpeg" width="800" height="571"></picture></p>\n');
});

test.serial("markdownItEleventyImg with markdown-it with renderImage (dryrun)", t => {
  const result = md.use(markdownItEleventyImg, {
    imgOptions: {
      dryRun: true
    },
    renderImage(image, attributes) {
      const [ Image, options ] = image;
      const [ src, attrs ] = attributes;

      t.true(typeof Image === "function");
      t.true(typeof options === "object" && options.dryRun);
      t.true(typeof src === "string");
      t.true(typeof attrs === "object" && !attrs.src);

      Image(src, options);

      const metadata = Image.statsSync(src, options);
      
      t.true(typeof metadata === "object");

      const imageMarkup = Image.generateHTML(metadata, attrs, {
        whitespaceMode: "inline"
      });
    
      return `<figure>${imageMarkup}${attrs.title ? `<figcaption>${attrs.title}</figcaption>` : ""}</figure>`;
    }
  }).render(imageDiplomees2021);

  t.is(result, '<p><figure><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img alt="Alt diplomees2021" title="Title diplomees2021" src="/img/pRWAdktn3m-2048.jpeg" width="2048" height="1463"></picture><figcaption>Title diplomees2021</figcaption></figure></p>\n');
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

test.serial("markdownItEleventyImg with Eleventy with renderImage (dryrun)", async t => {
  let elev = new Eleventy(eleventyInput, eleventyOutput, {
    config(config) {
      config.setLibrary("md", md.use(markdownItEleventyImg, {
        imgOptions: {
          dryRun: true
        },
        renderImage(image, attributes) {
          const [ Image, options ] = image;
          const [ src, attrs ] = attributes;

          t.true(typeof Image === "function");
          t.true(typeof options === "object" && options.dryRun);
          t.true(typeof src === "string");
          t.true(typeof attrs === "object" && !attrs.src);
    
          Image(src, options);
    
          const metadata = Image.statsSync(src, options);
          
          t.true(typeof metadata === "object");

          const imageMarkup = Image.generateHTML(metadata, attrs, {
            whitespaceMode: "inline"
          });
        
          return `<figure>${imageMarkup}${attrs.title ? `<figcaption>${attrs.title}</figcaption>` : ""}</figure>`;
        }
      }));
    }
  });
  let json = await elev.toJSON();
  
  t.is(json[0].content, '<p><figure><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img alt="Alt diplomees2021" title="Title diplomees2021" src="/img/pRWAdktn3m-2048.jpeg" width="2048" height="1463"></picture><figcaption>Title diplomees2021</figcaption></figure></p>\n');
});

test("Remote images not throwing error", t => {
  t.notThrows(() => {
    md
    .use(markdownItEleventyImg, {
      imgOptions: {
        dryRun: true
      }
    })
    .render(remoteImage);
  });
});

test.serial("Remote images falls back to default markdown-it renderer", t => {
  const result = md
  .use(markdownItEleventyImg, {
    imgOptions: {
      dryRun: true
    }
  })
  .render(remoteImage);

  t.is(result, '<p><img src="https://apod.nasa.gov/apod/image/2208/StargateMilkyWay_Oudoux_1800.jpg" alt=""></p>\n');
});

test.serial("Remote images with `statsByDimensionsSync`", t => {
  const result = md
  .use(markdownItEleventyImg, {
    imgOptions: {
      dryRun: true
    },
    renderImage(image, attributes) {
      const [ Image, options ] = image;
      const [ src, attrs ] = attributes;

      Image(src, options);

      const metadata = Image.statsByDimensionsSync(src, 1800, 1800, options);
      const imageMarkup = Image.generateHTML(metadata, attrs, {
        whitespaceMode: "inline"
      });

      return imageMarkup;
    }
  })
  .render(remoteImage);

  t.is(result, '<p><picture><source type="image/webp" srcset="/img/AxQcZ32Em8-1800.webp 1800w"><img alt="" src="/img/AxQcZ32Em8-1800.jpeg" width="1800" height="1800"></picture></p>\n');
});

test.serial("markdown-it-implicit-figures with options (dryrun)", t => {
  const result = md
  .use(implicitFigures, {
    dataType: true,
    figcaption: true,
    tabindex: true,
    link: true
  })
  .use(markdownItEleventyImg, {
    imgOptions: {
      dryRun: true
    }
  })
  .render(imageDiplomees2021);

  t.is(result, '<figure data-type="image" tabindex="1"><a href="./assets/images/diplomees2021.jpg"><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img alt="Alt diplomees2021" title="Title diplomees2021" src="/img/pRWAdktn3m-2048.jpeg" width="2048" height="1463"></picture></a><figcaption>Alt diplomees2021</figcaption></figure>\n');
});

test.after("cleanup", t => {
  const imgDir = "img";

  if(fs.existsSync(imgDir)) {
    fs.rmSync(imgDir, { recursive: true });
  }
});