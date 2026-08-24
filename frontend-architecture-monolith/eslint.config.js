import js from "@eslint/js";
import boundaries from "eslint-plugin-boundaries";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "*.d.ts"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      boundaries,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
      "boundaries/element": [
        {
          type: "modules",
          pattern: "src/modules/*/**/*",
          mode: "full",
          capture: ["moduleName"],
        },
        {
          type: "authentication",
          pattern: "src/modules/authentication/**/*",
          mode: "full",
        },
        {
          type: "shared",
          pattern: "src/shared/**/*",
          mode: "full",
        },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              allow: { dependency: { kind: "type" } },
            },
            {
              from: { type: "authentication" },
              allow: { to: { type: ["authentication", "shared"] } },
            },
            {
              from: { type: "shared" },
              allow: { to: { type: ["shared"] } },
            },
            {
              from: { type: "modules" },
              allow: [
                { to: { type: ["shared", "authentication"] } },
                {
                  to: {
                    type: ["module"],
                    captured: {
                      moduleName: "{{from.captured.moduleName}}",
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
);
