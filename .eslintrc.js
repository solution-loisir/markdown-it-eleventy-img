module.exports = {
  env: {  
    es6: true,
    node: true
  },
  extends: "eslint:recommended",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018
  },
  rules: {
    indent: ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    semi: ["error", "always"],
    "no-unused-vars": ["warn"],
    quotes: ["error", "double", { "avoidEscape": true }]
  }
}