module.exports = {
  root: true,
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  extends: [
      "airbnb-base",
      'airbnb-typescript/base',
      'prettier',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
      parser: "@typescript-eslint/parser",
      sourceType: "module",
      project: './tsconfig.json',
      tsconfigRootDir: __dirname,
  },
};