const fs = require("fs");
const path = require("path");

// for (const dir of [
//   path.join(__dirname, "dist-electron"),
//   path.join(__dirname, "out"),
//   path.join(__dirname, "dist-react"),
// ])
//   !fs.existsSync(dir) || fs.rmSync(dir, { recursive: true });

console.log("Cleaning Dirs");
[
  path.join(__dirname, "dist-electron"),
  //   path.join(__dirname, "out"),
  path.join(__dirname, "dist-react"),
].forEach((dir) => {
  if (fs.existsSync(dir)) {
    console.log("Cleaning Dir: " + dir);
    fs.rmSync(dir, { recursive: true });
  }
});
console.log("Finished Cleaning Dirs");
