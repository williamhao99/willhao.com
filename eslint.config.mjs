import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextCoreWebVitals,
  {
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
  // House conventions (see CLAUDE.md), enforced so they survive tooling and
  // contributors instead of relying on manual discipline
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
  globalIgnores([".next/**", "node_modules/**", "temp-stash/**"]),
]);
