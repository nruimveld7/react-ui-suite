module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2022,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: ["dist", "src/dist", "node_modules", "demo/dist"],
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
};
