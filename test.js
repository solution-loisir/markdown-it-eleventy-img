const test = require("ava");
const md = require("markdown-it")();
const markdownItAttrs = require("markdown-it-attrs");
const implicitFigures = require("markdown-it-implicit-figures");
const markdownItEleventyImg = require("./");
const logWarningFor = require("./utilities/warnings");
const generateAttrsObject = require("./utilities/generate-attrs-object");
const { remove } = require("./utilities/remove-key-from");
const { propertiesFrom } = require("./utilities/lower-case-trim-object");
const fs = require("fs");
const path = require("path");
const Eleventy = require("@11ty/eleventy");
const eleventyInput = "test-eleventy/default";
const eleventyInputRelative = "test-eleventy/relative-image";
const eleventyOutput = "_site";
const imageDiplomees2021 = '![Alt diplomees2021](./assets/images/diplomees2021.jpg "Title diplomees2021")';
const imagemarkdownItAttrs = '![Alt diplomees2021](./assets/images/diplomees2021.jpg "Title diplomees2021"){loading=lazy}';
const imgWithoutTitle = "![Alt diplomees2021](./assets/images/diplomees2021.jpg)";
const imgWithEmptyTitle = '![Alt diplomees2021](./assets/images/diplomees2021.jpg "")';
const remoteSrc = "https://apod.nasa.gov/apod/image/2208/StargateMilkyWay_Oudoux_1800.jpg";
const remoteSrc_1 = "https://www.nasa.gov/sites/default/files/thumbnails/image/web_first_images_release.png";
const remoteSrc_2 = "https://www.nasa.gov/sites/default/files/thumbnails/image/main_image_deep_field_smacs0723-5mb.jpg";
const remoteImage = `![](${remoteSrc})`;
const remoteImageAlt = `![My cool space pic](${remoteSrc})`;
const remoteImageAltAndTitle = `![My cool space pic](${remoteSrc} "Remote title")`;
const multipleRemoteImages = `![First alt](${remoteSrc} "First title")\n![Second alt](${remoteSrc_1} "Second title")\n![Third alt](${remoteSrc_2} "Third title")`;
const multipleLocalImages = `${imageDiplomees2021}\n![Alt sejour](./assets/images/sejour-plein-air.jpg "Title sejour")`;
const markdownItAttrsWidthAndHeight = "![](./assets/images/diplomees2021.jpg){width=200 height=100}";

test("Not passing global width and height to local images", t => {
  const result = md.use(markdownItEleventyImg, {
    imgOptions: {
      dryRun: true
    },
    globalAttributes: {
      width: 1800,
      height: 900
    }
  }).render(multipleLocalImages);

  t.is(result, '<p><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img width="2048" height="1463" alt="Alt diplomees2021" title="Title diplomees2021" src="/img/pRWAdktn3m-2048.jpeg"></picture>\n' +
  '<picture><source type="image/webp" srcset="/img/jxfAXAKLAr-958.webp 958w"><img width="958" height="504" alt="Alt sejour" title="Title sejour" src="/img/jxfAXAKLAr-958.jpeg"></picture></p>\n');
});

test("Global width and height are present in the attributes object", t => {
  md.use(markdownItEleventyImg, {
    imgOptions: {
      dryRun: true
    },
    globalAttributes: {
      width: 1800,
      height: 900
    },
    renderImage(image, attributes) {
      const [src, attrs] = attributes;
      t.is(attrs.width, 1800);
      t.is(attrs.height, 900);
    }
  }).render(multipleLocalImages);
});

test("Empty string title is undefined", t => {
  md.use(markdownItEleventyImg, {
    imgOptions: {
      dryRun: true
    },
    renderImage(image, attributes) {
      const [src, attrs] = attributes;
      t.is(attrs.title, undefined);
    }
  }).render(imgWithEmptyTitle);
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
  }).render(imgWithoutTitle);
});

test.serial("Title in globalAttributes is overriden by token title", t => {
  const result = md.use(markdownItEleventyImg, {
    imgOptions: {
      dryRun: true
    },
    globalAttributes: {
      "  Title": "Global title"
    }
  }).render(imageDiplomees2021);

  t.is(result, '<p><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img title="Title diplomees2021" alt="Alt diplomees2021" src="/img/pRWAdktn3m-2048.jpeg" width="2048" height="1463"></picture></p>\n');
});

test.serial("Title in globalAttributes is passed on token with empty title", t => {
  const result = md.use(markdownItEleventyImg, {
    imgOptions: {
      dryRun: true
    },
    globalAttributes: {
      "TITLE": ""
    }
  }).render(imgWithEmptyTitle);

  t.is(result, '<p><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img title="" alt="Alt diplomees2021" src="/img/pRWAdktn3m-2048.jpeg" width="2048" height="1463"></picture></p>\n');
});

test.serial("Title in globalAttributes is applied when no token title", t => {
  const result = md.use(markdownItEleventyImg, {
    imgOptions: {
      dryRun: true
    },
    globalAttributes: {
      title: "Global title"
    }
  }).render(imgWithoutTitle);

  t.is(result, '<p><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img title="Global title" alt="Alt diplomees2021" src="/img/pRWAdktn3m-2048.jpeg" width="2048" height="1463"></picture></p>\n');
});

test("Log warning for alt", t => {
  const globalAttributes = {
    alt: ""
  };

  t.is(logWarningFor(globalAttributes), "Markdown-it-eleventy-img WARNING: Setting `alt` in `globalAttributes` will have no effect on the markdown image output. The `alt` attribute has to be set on the markdown image token.");
});

test("Log warning for src", t => {
  const globalAttributes = {
    src: ""
  };

  t.is(logWarningFor(globalAttributes), "Markdown-it-eleventy-img WARNING: Setting `src` in `globalAttributes` will have no effect on the markdown image output. The `src` attribute has to be set on the markdown image token.");
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

test("typeFunctionError for `resolvePath` (string throwing)", t => {
  t.throws(() => {
    md.use(markdownItEleventyImg, {
      resolvePath: "string"
    });
  });
});

test("typeFunctionError for `renderImage` (string throwing)", t => {
  t.throws(() => {
    md.use(markdownItEleventyImg, {
      renderImage: "string"
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

test("generate-attrs-object (trimmed and lower case result)", t => {
  const tokenArray = { attrs: [[" SRC", "my/src/"], ["Alt   ", "This alt test"]] };

  const output = generateAttrsObject(tokenArray).attrs;

  t.deepEqual(output, {
    "src": "my/src/",
    "alt": "This alt test"
  });
});

test("remove-key-from", t => {
  const tokenAttributes = {
    src: "./assets/images/diplomees2021.jpg",
    alt: "Alt diplomees2021",
    title: "Title diplomees2021"
  };

  const tokenAttributesWithoutSrc = remove("src").from(tokenAttributes);

  t.deepEqual(tokenAttributesWithoutSrc, {
    alt: "Alt diplomees2021",
    title: "Title diplomees2021"
  });
});

test("propertiesFrom", t => {
  const testObject = {
    " SRC  ": "my/source/img.jpg",
    "   Title ": "My title"
  };

  const result = propertiesFrom(testObject).lowerCased().trimmed().object();

  t.deepEqual(result, {
    src: "my/source/img.jpg",
    title: "My title"
  });
});

test("markdown-it-attrs overrides globalAttributes (typed string)", t => {
  md.use(markdownItAttrs)
    .use(markdownItEleventyImg, {
      imgOptions: {
        dryRun: true
      },
      globalAttributes: {
        width: 1800,
        height: 900
      },
      renderImage(image, attributes) {
        const [src, attrs] = attributes;
        t.true(typeof attrs.width === "string");
        t.is(attrs.width, "200");
        t.true(typeof attrs.height === "string");
        t.is(attrs.height, "100");
      }
    }).render(markdownItAttrsWidthAndHeight);
});

test("Width and height attributes are not passed to local image output (from token or from config)", t => {
  const result = md
    .use(markdownItAttrs)
    .use(markdownItEleventyImg, {
      imgOptions: {
        dryRun: true
      },
      globalAttributes: {
        width: 1800,
        height: 900
      }
    }).render(markdownItAttrsWidthAndHeight);

  t.is(result, '<p><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img width="2048" height="1463" alt="" src="/img/pRWAdktn3m-2048.jpeg"></picture></p>\n');
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

  t.is(result, '<p><picture><source type="image/avif" srcset="/images/pRWAdktn3m-300.avif 300w, /images/pRWAdktn3m-500.avif 500w, /images/pRWAdktn3m-800.avif 800w" sizes="100vw"><source type="image/webp" srcset="/images/pRWAdktn3m-300.webp 300w, /images/pRWAdktn3m-500.webp 500w, /images/pRWAdktn3m-800.webp 800w" sizes="100vw"><img class="markdown-image" decoding="async" alt="Alt diplomees2021" title="Title diplomees2021" src="/images/pRWAdktn3m-300.jpeg" width="800" height="571" srcset="/images/pRWAdktn3m-300.jpeg 300w, /images/pRWAdktn3m-500.jpeg 500w, /images/pRWAdktn3m-800.jpeg 800w" sizes="100vw"></picture></p>\n');
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

test.serial("markdownItEleventyImg with Eleventy using custom image path resolution for relative images.", async t => {
  let elev = new Eleventy(eleventyInputRelative, eleventyOutput, {
    config(config) {
      config.setLibrary("md", md.use(markdownItEleventyImg, {
        resolvePath: (filepath, env) => path.join(path.dirname(env.page.inputPath), filepath)
      }));
    }
  });
  let json = await elev.toJSON();
  
  t.is(json[0].content, '<p><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img alt="Alt diplomees2021" title="Title diplomees2021" src="/img/pRWAdktn3m-2048.jpeg" width="2048" height="1463"></picture></p>\n');
});

test.serial("markdownItEleventyImg with Eleventy using using `resolvePath` with remote images.", async t => {
  const result = md.use(markdownItEleventyImg, {
    resolvePath: (filepath, env) => path.join(path.dirname(env.page.inputPath), filepath)
  }).render(remoteImage);
  
  t.is(result, '<p><img src="https://apod.nasa.gov/apod/image/2208/StargateMilkyWay_Oudoux_1800.jpg" alt=""></p>\n');
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
  
  t.is(json[0].content, '<p><picture><source type="image/avif" srcset="/images/pRWAdktn3m-300.avif 300w, /images/pRWAdktn3m-500.avif 500w, /images/pRWAdktn3m-800.avif 800w" sizes="100vw"><source type="image/webp" srcset="/images/pRWAdktn3m-300.webp 300w, /images/pRWAdktn3m-500.webp 500w, /images/pRWAdktn3m-800.webp 800w" sizes="100vw"><img class="markdown-image" decoding="async" alt="Alt diplomees2021" title="Title diplomees2021" src="/images/pRWAdktn3m-300.jpeg" width="800" height="571" srcset="/images/pRWAdktn3m-300.jpeg 300w, /images/pRWAdktn3m-500.jpeg 500w, /images/pRWAdktn3m-800.jpeg 800w" sizes="100vw"></picture></p>\n');
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
    md.use(markdownItEleventyImg, {
      imgOptions: {
        dryRun: true
      }
    }).render(remoteImage);
  });
});

test.serial("Remote images falls back to default markdown-it renderer (no alt)", t => {
  const result = md
    .use(markdownItEleventyImg, {
      imgOptions: {
        dryRun: true
      }
    }).render(remoteImage);

  t.is(result, '<p><img src="https://apod.nasa.gov/apod/image/2208/StargateMilkyWay_Oudoux_1800.jpg" alt=""></p>\n');
});

test.serial("Remote images properly pass through alt tags into customised markdown-it-renderer", t => {
  const result = md
    .use(markdownItEleventyImg, {
      imgOptions: {
        dryRun: true
      }
    }).render(remoteImageAlt);

  t.is(result, '<p><img src="https://apod.nasa.gov/apod/image/2208/StargateMilkyWay_Oudoux_1800.jpg" alt="My cool space pic"></p>\n');
});

test.serial("Remote images properly pass through alt and title", t => {
  const result = md
    .use(markdownItEleventyImg, {
      imgOptions: {
        dryRun: true
      }
    }).render(remoteImageAltAndTitle);

  t.is(result, '<p><img src="https://apod.nasa.gov/apod/image/2208/StargateMilkyWay_Oudoux_1800.jpg" alt="My cool space pic" title="Remote title"></p>\n');
});

test.serial("Remote images properly pass through alt and title on multiple images", t => {
  const result = md
    .use(markdownItEleventyImg, {
      imgOptions: {
        dryRun: true
      }
    }).render(multipleRemoteImages);

  t.is(result, '<p><img src="https://apod.nasa.gov/apod/image/2208/StargateMilkyWay_Oudoux_1800.jpg" alt="First alt" title="First title">\n' +
  '<img src="https://www.nasa.gov/sites/default/files/thumbnails/image/web_first_images_release.png" alt="Second alt" title="Second title">\n' +
  '<img src="https://www.nasa.gov/sites/default/files/thumbnails/image/main_image_deep_field_smacs0723-5mb.jpg" alt="Third alt" title="Third title"></p>\n');
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
    }).render(imageDiplomees2021);

  t.is(result, '<figure data-type="image" tabindex="1"><a href="./assets/images/diplomees2021.jpg"><picture><source type="image/webp" srcset="/img/pRWAdktn3m-2048.webp 2048w"><img alt="Alt diplomees2021" title="Title diplomees2021" src="/img/pRWAdktn3m-2048.jpeg" width="2048" height="1463"></picture></a><figcaption>Alt diplomees2021</figcaption></figure>\n');
});

test.after("cleanup", () => {
  const imgDir = "img";

  if(fs.existsSync(imgDir)) {
    fs.rmSync(imgDir, { recursive: true });
  }
});