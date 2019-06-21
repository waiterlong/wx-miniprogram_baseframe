module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module"
  },
  rules: {
    indent: ['error', 2],
    quotes: 0,
    semi: 0,
    'no-console': 0,
    'no-unused-vars': 1
  },
  globals: {
    getApp: false,
    Page: false,
    wx: false,
    App: false,
    getCurrentPages: false,
    Component: false
  }
};
