import { createEslintConfig } from "@commerceos/tooling/eslint";

export default createEslintConfig({
  boundaryElements: [
    { type: "authentication", category: "platform", pattern: "src/modules@commerceos/authentication/**/*", mode: "full" },
    { type: "shared", category: "platform", pattern: "src@commerceos/shared/**/*", mode: "full" },
    { type: "modules", pattern: "src/modules/*/**/*", capture: ["moduleName"], mode: "full" },
  ],
});
