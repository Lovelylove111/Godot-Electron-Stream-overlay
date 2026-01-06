const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

async function exportGodot() {
  const exportPreset = "HTML5";
  const outputDir = path.join(__dirname, "dist-electron", "godot");
  const outputFile = path.join(outputDir, "index.html");
  const projectPath = path.join(__dirname, "godotProject");

  fs.mkdirSync(outputDir, { recursive: true });

  const args = [
    "--headless",
    "--path",
    projectPath,
    "--export-release",
    exportPreset,
    outputFile,
  ];

  return new Promise((resolve, reject) => {
    console.log("🚀 Godot exporting");
    const godot = spawn("godot", args, { stdio: "inherit" });

    godot.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Godot export succeeded.");
        resolve();
      } else {
        console.error(`❌ Godot export failed with exit code ${code}`);
        reject(new Error(`Godot export failed with code ${code}`));
      }
    });

    godot.on("error", (err) => {
      console.error(`❌ Failed to start Godot: ${err.message}`);
      reject(err);
    });
  });
}

//Make sure to have godot in your path with the name "godot", you can create a symbolic link to rename the original executable
exportGodot();
