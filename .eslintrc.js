module.exports = {
  // parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  plugins: ['@typescript-eslint/eslint-plugin'],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  extends: [
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  rules: {
    // suppress errors for missing 'import React' in files
    'react/react-in-jsx-scope': 'off',
    // allow jsx syntax in js files (for next.js project)
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }], //should add ".ts" if typescript project
    indent: [2, 2],
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'prettier/prettier': ['warn', { endOfLine: 'auto' }],
    // 'no-unused-vars': 'warn',
    // 'react/prop-types': 'warn',
    // 'prettier/prettier': 'warn',
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  globals: {
    React: true,
    mount: true,
    mountWithRouter: true,
    shallow: true,
    shallowWithRouter: true,
    context: true,
    expect: true,
    jsdom: true,
    JSX: true,
  },
};
