import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const uploadsDir = path.resolve(process.cwd(), "public/uploads");

function getExtensionFromMimeType(mimeType) {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/svg+xml":
      return ".svg";
    default:
      return "";
  }
}

function getUploadFileName(originalName, mimeType) {
  const parsedExtension = path.extname(originalName ?? "").toLowerCase();
  const extension = parsedExtension || getExtensionFromMimeType(mimeType) || ".bin";
  return `${Date.now()}-${randomUUID()}${extension}`;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks).toString("utf8");
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

async function handleAvatarUpload(req, res) {
  try {
    const payload = await readJsonBody(req);
    const dataUrl = typeof payload.dataUrl === "string" ? payload.dataUrl : "";
    const fileName = typeof payload.fileName === "string" ? payload.fileName : "avatar";
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

    if (!match) {
      sendJson(res, 400, { message: "Invalid image payload" });
      return;
    }

    const [, mimeType, base64Data] = match;
    const bytes = Buffer.from(base64Data, "base64");

    if (!bytes.length) {
      sendJson(res, 400, { message: "Uploaded image is empty" });
      return;
    }

    await fs.mkdir(uploadsDir, { recursive: true });
    const uploadFileName = getUploadFileName(fileName, mimeType);
    await fs.writeFile(path.join(uploadsDir, uploadFileName), bytes);

    sendJson(res, 201, { url: `/uploads/${uploadFileName}` });
  } catch {
    sendJson(res, 500, { message: "Avatar upload failed" });
  }
}

function avatarUploadPlugin() {
  const middleware = async (req, res, next) => {
    if (req.method === "POST" && (req.url === "/api/uploads/avatar" || req.url === "/api/uploads/image")) {
      await handleAvatarUpload(req, res);
      return;
    }

    next();
  };

  return {
    name: "avatar-upload",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), avatarUploadPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
});
