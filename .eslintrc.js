module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  overrides: [{
    files: ['*.ts', '*.vue'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': ['error'],
      '@typescript-eslint/explicit-module-boundary-types': ['error'],
    },
  }],
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
  ],
  plugins: [],
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    'class-methods-use-this': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'lines-between-class-members': ['error', 'always'],
    'no-plusplus': 'off',
    'object-curly-spacing': ['error', 'always'],
    'object-curly-newline': ['error', {
      ObjectExpression: { minProperties: 4, multiline: true, consistent: true },
      ObjectPattern: { minProperties: 4, multiline: true, consistent: true },
      ImportDeclaration: { minProperties: 4, multiline: true, consistent: true },
      ExportDeclaration: { minProperties: 4, multiline: true, consistent: true },
    }],
    'space-before-function-paren': [2, {
      anonymous: 'always',
      named: 'never',
    }],
    semi: ['error', 'always'],

    'vue/no-v-html': 'off',
  },
};
