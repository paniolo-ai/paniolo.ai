import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "dist");

if (existsSync(join(root, "js", "main.ts"))) {
  execSync("tsc", { cwd: root, stdio: "inherit" });
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);
mkdirSync(join(dist, "js"));

cpSync(join(root, "index.html"), join(dist, "index.html"));
cpSync(join(root, "pages"), join(dist, "pages"), { recursive: true });
cpSync(join(root, "css"), join(dist, "css"), { recursive: true });
cpSync(join(root, "js", "main.js"), join(dist, "js", "main.js"));

const assets = join(root, "assets");
if (existsSync(assets)) {
  cpSync(assets, join(dist, "assets"), { recursive: true });
}

console.log("dist/ ready for deploy");
