const crypto = require("crypto");

function randomIP() {
  return (
    Math.ceil(Math.random() * 255) +
    "." +
    Math.ceil(Math.random() * 255) +
    "." +
    Math.ceil(Math.random() * 255) +
    "." +
    Math.ceil(Math.random() * 255)
  );
}

function md5(str) {
  let hash = crypto.createHash("md5");
  hash.update(str);
  return hash.digest().toString("hex");
}

function stringMiddle(source, left, right) {
  if (typeof source !== "string") {
    return "";
  }

  let leftIndex = source.indexOf(left);
  if (leftIndex == -1) {
    return "";
  }
  leftIndex += left.length;

  let rightIndex = source.indexOf(right, leftIndex);
  if (rightIndex == -1) {
    return "";
  }

  return source.substring(leftIndex, rightIndex)
}


module.exports = {
  randomIP,
  md5,
  stringMiddle
};
