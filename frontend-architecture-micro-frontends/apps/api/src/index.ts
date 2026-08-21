import path from "node:path";
import { serve } from "@hono/node-server";
import { FileLocalStorage } from "./persistence/file-local-storage.ts";

const port = Number(process.env.PORT ?? 4000);
const dbFilePath = path.resolve(process.cwd(), "data/db.json");
const uploadsDir = path.resolve(process.cwd(), "../app-shell/public/uploads");

const localStorage = new FileLocalStorage(dbFilePath);
await localStorage.init();

Object.defineProperty(globalThis, "window", {
  value: { localStorage },
  configurable: true,
});

const { updateCurrentUser } = await import("@commerceos/shared/mocks/data/store");
if (localStorage.length === 0) {
  updateCurrentUser("user_owner", {});
}

const { createApp } = await import("./app.ts");
const app = createApp({ uploadsDir });

console.log(`CommerceOS API listening on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
