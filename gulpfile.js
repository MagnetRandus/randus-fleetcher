/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");
const build = require("@microsoft/sp-build-web");

build.addSuppression(
  `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`
);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set("serve", result.get("serve-deprecated"));

  return result;
};

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    generatedConfiguration.resolve.alias["@Async"] = path.resolve(
      __dirname,
      "src/libraries/Async"
    );
    generatedConfiguration.module.rules.push({
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/,
    });

    generatedConfiguration.resolve.extensions.push(".ts", ".tsx");

    return generatedConfiguration;
  },
});

/* fast-serve */
const { addFastServe } = require("spfx-fast-serve-helpers");
addFastServe(build);
/* end of fast-serve */

build.initialize(require("gulp"));

// 'use strict';

// const build = require('@microsoft/sp-build-web');

// build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// var getTasks = build.rig.getTasks;
// build.rig.getTasks = function () {
//   var result = getTasks.call(build.rig);

//   result.set('serve', result.get('serve-deprecated'));

//   return result;
// };

// /* fast-serve */
// const { addFastServe } = require("spfx-fast-serve-helpers");
// addFastServe(build);
// /* end of fast-serve */

// build.initialize(require('gulp'));
