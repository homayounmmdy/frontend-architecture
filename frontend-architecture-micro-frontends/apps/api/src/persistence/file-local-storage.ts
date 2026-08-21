import fs from "node:fs/promises";
import path from "node:path";

type StorageMap = Record<string, string>;

async function atomicWriteJson(filePath: string, payload: StorageMap) {
  const next = `${filePath}.tmp`;
  await fs.writeFile(next, JSON.stringify(payload, null, 2), "utf8");
  await fs.rename(next, filePath);
}

export class FileLocalStorage implements Storage {
  private state: StorageMap = {};
  private writeQueue: Promise<void> = Promise.resolve();
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async init() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      this.state = raw.trim() ? (JSON.parse(raw) as StorageMap) : {};
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "ENOENT") throw error;
      this.state = {};
      await atomicWriteJson(this.filePath, this.state);
    }
  }

  get length() {
    return Object.keys(this.state).length;
  }

  clear() {
    this.state = {};
    void this.persist();
  }

  getItem(key: string) {
    return this.state[key] ?? null;
  }

  key(index: number) {
    return Object.keys(this.state)[index] ?? null;
  }

  removeItem(key: string) {
    delete this.state[key];
    void this.persist();
  }

  setItem(key: string, value: string) {
    this.state[key] = String(value);
    void this.persist();
  }

  private persist() {
    this.writeQueue = this.writeQueue.then(() => atomicWriteJson(this.filePath, this.state));
    return this.writeQueue;
  }
}
