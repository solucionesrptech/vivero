/**
 * Evita "Cannot find module .../dist/main":
 * 1) Si no hay carpeta dist pero sí tsbuildinfo, TS cree que ya compiló y no emite.
 * 2) Si falta dist/main.js, ejecuta nest build antes de nest start / watch / debug.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist");
const mainJs = path.join(distDir, "main.js");
const stamp = path.join(root, "tsconfig.build.tsbuildinfo");

if (!fs.existsSync(distDir) && fs.existsSync(stamp)) {
  fs.unlinkSync(stamp);
}

if (!fs.existsSync(mainJs)) {
  console.log("lab-plantalia-api: generando dist (nest build)…");
  execSync("npx nest build", {
    cwd: root,
    stdio: "inherit",
    env: process.env,
    shell: true,
  });
}
