import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const restrictPackages = (...names) => ({
  "no-restricted-imports": [
    "error",
    {
      patterns: names.map((name) => ({
        group: [`@alchemai/${name}`, `@alchemai/${name}/*`, `**/${name}/src/**`],
        message: `This package must not depend on @alchemai/${name}.`,
      })),
    },
  ],
});

export default defineConfig(
  { ignores: ["**/dist/**", "**/coverage/**"] },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js", "*.ts", "packages/*/vitest.config.ts"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
  { files: ["packages/contracts/**"], rules: restrictPackages("backend", "extension") },
  { files: ["packages/backend/**"], rules: restrictPackages("extension") },
  { files: ["packages/extension/**"], rules: restrictPackages("backend") },
  { files: ["**/*.js"], extends: [tseslint.configs.disableTypeChecked] },
);
