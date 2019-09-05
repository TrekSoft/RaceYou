module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    "prettier/prettier": ["error", { "singleQuote": true }],
    "comma-dangle": ["error", "never"],
    "consistent-this": 0,
    "react-native/no-inline-styles": 0
  }
};
