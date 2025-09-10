import { mkdirSync, rmSync, copyFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const src = join(process.cwd(), "public");
const dist = join(process.cwd(), "dist");

function copyDir(s, d) {
  mkdirSync(d, { recursive: true });
  for (const f of readdirSync(s)) {
    const sp = join(s, f);
    const dp = join(d, f);
    if (statSync(sp).isDirectory()) copyDir(sp, dp);
    else copyFileSync(sp, dp);
  }
}

rmSync(dist, { recursive: true, force: true });
copyDir(src, dist);
console.log("Static built -> dist/");
