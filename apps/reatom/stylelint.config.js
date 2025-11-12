export default {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
  rules: {
    // Class selector pattern (allow camelCase for CSS modules)
    'selector-class-pattern': null,

    // Allow unknown at-rules (for CSS modules :global, :local etc)
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['global', 'local'],
      },
    ],
  },

  // File patterns to lint
  ignoreFiles: ['dist/**/*', 'build/**/*', 'node_modules/**/*'],
}
