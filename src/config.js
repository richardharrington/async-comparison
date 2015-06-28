System.config({
  "baseURL": "/",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "*": "*.js"
  },
  "defaultJSExtensions": true
});

System.config({
  "map": {
    "babel": "npm:babel-core@5.6.4",
    "babel-runtime": "npm:babel-runtime@5.6.4",
    "co": "npm:co@4.5.4",
    "core-js": "npm:core-js@0.9.18",
    "js-csp": "npm:js-csp@0.4.1",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@5.6.4": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:js-csp@0.4.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

