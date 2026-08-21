import fs from "node:fs/promises";
import path from "node:path";

const dbFilePath = path.resolve(process.cwd(), "data/db.json");

await fs.mkdir(path.dirname(dbFilePath), { recursive: true });
await fs.writeFile(dbFilePath, "{}", "utf8");

console.log("Reset API data file to empty persisted state.");
