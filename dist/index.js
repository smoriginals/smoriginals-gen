#!/usr/bin/env node

// src/index.ts
function smosHello() {
  return "smoriginals-gen is running...";
}
function trimContext(code, maxLines = 200) {
  return code.split("\n").slice(-maxLines).join("\n");
}
function version() {
  return "0.1.0";
}
export {
  smosHello,
  trimContext,
  version
};
