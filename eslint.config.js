// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      // FIXME: this rule is not seem to get triggered:
      "@typescript-eslint/consistent-type-assertions": ["error", { "assertionStyle": "never" }],
    }
  }
);
