// Runs after `vite build`. Vite's build output (static/react/) contains
// index.html plus the JS/CSS assets. We move index.html into Django's
// templates/ folder — renamed to react_index.html so it can't collide
// with the legacy templates/index.html — while the JS/CSS assets stay in
// static/react/ where Django's staticfiles app serves them.
import { existsSync, mkdirSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distIndex = join(__dirname, "..", "..", "wanderly_django", "static", "react", "index.html");
const templatesDir = join(__dirname, "..", "..", "wanderly_django", "templates");
const target = join(templatesDir, "react_index.html");

if (!existsSync(distIndex)) {
  console.error(`postbuild: expected ${distIndex} to exist — did the vite build output path change?`);
  process.exit(1);
}

if (!existsSync(templatesDir)) mkdirSync(templatesDir, { recursive: true });

renameSync(distIndex, target);
console.log(`postbuild: moved index.html -> ${target}`);
