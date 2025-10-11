module.exports = {
  // Line formatting
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,

  // Trailing commas
  trailingComma: 'es5',

  // Spacing
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow functions
  arrowParens: 'avoid',

  // JSX
  jsxSingleQuote: false,

  // End of line
  endOfLine: 'lf',

  // React Native specific
  overrides: [
    {
      files: '*.tsx',
      options: {
        parser: 'typescript',
      },
    },
  ],
};
