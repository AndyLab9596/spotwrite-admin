module.exports = {
  root: true,
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-scss'],
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'value-list-comma-newline-after': null,
    'declaration-colon-newline-after': null,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],
  },
};
