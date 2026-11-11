import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist/**", "node_modules/**"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      // Providers and utility modules intentionally export a hook next to their
      // component; fast refresh still works for every component they export.
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true, allowExportNames: ["useTheme", "useZeroG"] },
      ],
    },
  },
  {
    // shadcn/ui primitives ship their variants object alongside the component.
    files: ["src/components/ui/**/*.tsx"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    // The physics arena keeps a measured-size cache in a ref and reads the
    // clock inside pointer handlers. Both are correct at runtime (handlers are
    // not render), but the compiler rules cannot prove that, so they warn
    // here instead of failing the whole lint run.
    files: ["src/components/sections/skills-arena.tsx"],
    rules: {
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
    },
  },
]);
