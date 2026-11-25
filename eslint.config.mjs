import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextCoreWebVitals,
  {
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
  // House conventions (see CLAUDE.md)
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ArrowFunctionExpression",
          message: "Use a regular function declaration (no arrow functions).",
        },
        {
          selector: "ConditionalExpression",
          message: "Use if/else (no ternaries).",
        },
        {
          selector: "SwitchStatement",
          message: "Use if/else (no switch).",
        },
        {
          selector: "TemplateLiteral",
          message: "Use string concatenation with + (no template literals).",
        },
        {
          selector:
            "CallExpression[callee.property.name=/^(map|filter|reduce|forEach)$/]",
          message: "Use a for loop (no array iteration methods).",
        },
      ],
    },
  },
  // One live copy of the data modules - see lib/data/live.ts
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["instrumentation.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/lib/data/spotify",
                "**/lib/data/chess",
                "**/lib/data/osu",
              ],
              allowTypeImports: true,
              message: "Import only types - instrumentation.ts runs these.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores(["temp-stash/**"]),
]);
