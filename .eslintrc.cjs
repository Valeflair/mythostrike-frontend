/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "@vue/eslint-config-prettier",
  ],
  rules: {
    "max-len": ["error", { code: 120 }],
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
};
