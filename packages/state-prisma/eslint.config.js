import { createTypeScriptConfig } from '../../eslint.shared.mjs';

export default [
  { ignores: ['tests/generated/**'] },
  ...createTypeScriptConfig({
    tsconfigRootDir: import.meta.dirname,
  }),
];
