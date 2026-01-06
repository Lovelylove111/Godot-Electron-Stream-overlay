const fs = require("fs");
const path = require("path");

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
