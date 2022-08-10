const test = require("ava");
const md = require("markdown-it");
const markdownItEleventyImg = require("./");
const logWarningFor = require("./utilities/warnings");

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
    md().use(markdownItEleventyImg, {
      imgOptions: ""
    });
  }, {message: "Markdown-it-eleventy-img: `imgOptions` needs to be an `object`."});
});

test("typeObjectError for imgOptions (number)", t => {
  t.throws(() => {
    md().use(markdownItEleventyImg, {
      imgOptions: 1
    });
  }, {message: "Markdown-it-eleventy-img: `imgOptions` needs to be an `object`."});
});

test("typeObjectError for imgOptions (array)", t => {
  t.throws(() => {
    md().use(markdownItEleventyImg, {
      imgOptions: []
    });
  }, {message: "Markdown-it-eleventy-img: `imgOptions` needs to be an `object`."});
});

test("typeObjectError for imgOptions (null)", t => {
  t.throws(() => {
    md().use(markdownItEleventyImg, {
      imgOptions: null
    });
  }, {message: "Markdown-it-eleventy-img: `imgOptions` needs to be an `object`."});
});

test("typeObjectError for imgOptions (undefined not throwing)", t => {
  t.notThrows(() => {
    md().use(markdownItEleventyImg, {
      imgOptions: undefined
    });
  });
});