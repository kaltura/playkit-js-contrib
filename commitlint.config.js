module.exports = {
  extends: ['@commitlint/config-conventional'],
  "rules": {
    "header-max-length": [2, "always", 150],
    "scope-enum": [2, "always", ["devop", "common", "linkify", "plugin", "push-notifications", "ui", "release"]]
  }
};
