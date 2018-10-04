"use strict";

function __export(m) {
  for (var p in m)
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", {
  value: true
});
__export(require("./dist/dynamodb.dao"));
__export(require("./dist/model"));
__export(require("./dist/dynamodb.plugin"));