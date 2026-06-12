/** @type {import('stylelint').Config} */
export default {
    extends: 'stylelint-config-standard-scss',
    rules: {
        'declaration-empty-line-before': 'never',
        'selector-id-pattern': '^[a-z][a-zA-Z]+$',
        'function-name-case': 'lower',
        'selector-class-pattern': 'lowercase-and-dashes',
        'no-duplicate-selectors': true,
        'scss/at-mixin-pattern': '^[a-z][a-zA-Z]+$',
        'scss/at-function-pattern': '^[a-z][a-zA-Z]+$',
        'scss/dollar-variable-pattern': '([a-z0-9\-\_]+)'
    }
};
