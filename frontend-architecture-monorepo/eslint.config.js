import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";

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
      "boundaries/elements": [
        { type: "authentication", category: "platform", pattern: "src/modules/authentication/**/*", mode: "full" },
        { type: "shared", category: "platform", pattern: "src/shared/**/*", mode: "full" },
        { type: "modules", pattern: "src/modules/*/**/*", capture: ["moduleName"], mode: "full" },
      ]
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "boundaries/dependencies": ["error", {
        default: "disallow",
        rules: [
          { allow: { dependency: { kind: 'type' } } },
          {
            from: { category: "platform" },
            allow: { to: { category: ["platform"] } }
          },
          {
            from: { type: "modules" },
            allow: [
              { to: { category: "platform" } },
              { to: { type: ["modules"], captured: { moduleName: "{{ from.captured.moduleName }}" } } },
            ]
          }
        ]
      }]
    },
  },
);
