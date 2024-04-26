/** @type {import("eslint").Linter.Config} */
const config = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "extends": [
    "next/core-web-vitals",
  ],
  "rules": {
    "react/no-unescaped-entities": 0,
    "react-hooks/exhaustive-deps": 0,
    "@next/next/no-img-element": 0,
    "jsx-a11y/alt-text": 0
  }
}
module.exports = config;
