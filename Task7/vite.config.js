import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Returns the paths of all files inside a folder (including sub-folders).
function listFiles(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full, base);
    return path.relative(base, full).split(path.sep).join("/");
  });
}

// After the build, fills in the file list and a build id inside dist/sw.js
function serviceWorkerPlugin() {
  let outDir = "dist";
  return {
    name: "service-worker-precache",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const swPath = path.join(outDir, "sw.js");
      if (!fs.existsSync(swPath)) return;

      const files = listFiles(outDir).filter(
        (file) =>
          file !== "sw.js" &&
          file !== "ping.txt" &&
          !file.startsWith("api/") && // API data is cached later, at runtime
          !file.endsWith(".map"),
      );

      const template = fs.readFileSync(swPath, "utf8");
      const hash = crypto.createHash("sha256");
      hash.update(template);
      for (const file of files) {
        hash.update(file);
        hash.update(fs.readFileSync(path.join(outDir, file)));
      }
      const buildId = hash.digest("hex").slice(0, 10);

      const code = template
        .replace('"__BUILD_ID__"', JSON.stringify(buildId))
        .replace('["__PRECACHE_URLS__"]', JSON.stringify(files));
      fs.writeFileSync(swPath, code);
      console.log(`Service worker: build ${buildId}, ${files.length} files pre-cached`);
    },
  };
}

export default defineConfig({
  plugins: [react(), serviceWorkerPlugin()],
  base: "/React-Fall-2026/Task7/",
});