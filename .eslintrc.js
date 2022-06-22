module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    'airbnb-base',
    'eslint-config-prettier', // Resolves ESLint and Prettier conflicts
  ],
  plugins: ['vue'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'always',
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'no-console':
      process.env.NODE_ENV === 'production'
        ? ['error', { allow: ['warn', 'error'] }]
        : 'off',
    'import/no-unresolved': 'off',
    camelcase: 'off',
    'consistent-return': 'off',
    'no-alert': 'off',
  },
  settings: {
    'import/core-modules': ['vue', 'vuex'], // these modules are included in nuxt.js
    'import/resolver': {
      node: {
        extensions: ['.js', '.json', '.ts', '.vue'],
      },
    },
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.vue'],
      rules: {
        '@typescript-eslint/typedef': 2,
      },
    },
    {
      files: [
        'components/Admin/Modules/Tab/BaseTabs.vue',
        'components/Admin/Modules/Accordion/Accordion.vue',
        'components/App/molecules/card/PostCard.vue',
      ],
      rules: {
        'vue/no-v-html': 0,
      },
    },
  ],
};
