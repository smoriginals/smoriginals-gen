// src/index.ts
function smosHello() {
  return "smoriginals-gen is running...";
}
function trimContext(code, maxLines = 200) {
  return code.split("\n").slice(-maxLines).join("\n");
}

export {
  smosHello,
  trimContext
};
