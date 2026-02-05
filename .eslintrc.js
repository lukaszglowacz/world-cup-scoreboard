module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // Enforce explicit return types on functions
    '@typescript-eslint/explicit-function-return-type': 'error',
    
    // Disallow any type
    '@typescript-eslint/no-explicit-any': 'error',
    
    // Enforce unused variables check
    '@typescript-eslint/no-unused-vars': 'error',
    
    // Enforce consistent naming conventions
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'class',
        format: ['PascalCase'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
      },
    ],
  },
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['dist', 'coverage', 'node_modules', '*.js'],
};