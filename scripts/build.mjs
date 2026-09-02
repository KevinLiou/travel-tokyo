import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const site = resolve(root, "site");
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(site, dist, { recursive: true });
await cp(resolve(root, "tokens.css"), resolve(dist, "tokens.css"));

for (const file of ["index.html", "styles.css", "sw.js"]) {
  const path = resolve(dist, file);
  const content = await readFile(path, "utf8");
  await writeFile(path, content.replaceAll("../tokens.css", "./tokens.css"));
}

console.log(`Built static site to ${dist}`);
