import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["**/*.config.js", "node_modules/*", "/.git", "/.vscode", ".gitignore"]
  },
  {
    files: ["src/**/*.ts", "test/**/*.ts"],
    rules: {
      semi: ["error", "always"], // ;
      quotes: ["error", "double"], // "" for string
      indent: ["error", 2], // 2 spaces for indentation
      "key-spacing": ["error", { afterColon: true }],
      "@typescript-eslint/no-non-null-assertion": "off" // Allow ! to convert to type non-null
    },
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.browser // for the global objects like 'window' or 'document'
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended
];
