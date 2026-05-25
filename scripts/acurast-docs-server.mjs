#!/usr/bin/env node

import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = path.resolve(process.env.PROOF_DOCS_BUILD_DIR ?? path.join(rootDir, "build"));
const port = positiveInteger(process.env.PORT) ?? 3000;
const host = process.env.HOST ?? "0.0.0.0";

const server = createServer(async (request, response) => {
  try {
    if (request.url === undefined) {
      response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
      response.end("bad request\n");
      return;
    }

    const url = new URL(request.url, "http://localhost");
    if (url.pathname === "/health") {
      response.writeHead(200, {
        "cache-control": "no-store",
        "content-type": "application/json; charset=utf-8"
      });
      response.end(`${JSON.stringify({ ok: true, service: "proof-docs", checkedAt: new Date().toISOString() })}\n`);
      return;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { allow: "GET, HEAD", "content-type": "text/plain; charset=utf-8" });
      response.end("method not allowed\n");
      return;
    }

    const asset = await resolveAsset(url.pathname);
    if (!asset) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("not found\n");
      return;
    }

    response.writeHead(200, {
      "cache-control": cacheControlFor(asset.relativePath),
      "content-length": String(asset.size),
      "content-type": contentTypeFor(asset.relativePath)
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    createReadStream(asset.absolutePath).pipe(response);
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(`${error instanceof Error ? error.message : "internal error"}\n`);
  }
});

server.listen(port, host, () => {
  console.log(`PROOF docs server listening on http://${host}:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    server.close(() => process.exit(0));
  });
}

async function resolveAsset(pathname) {
  const normalized = normalizeRequestPath(pathname);
  if (normalized === undefined) return undefined;

  const candidates = [];
  if (normalized === "") candidates.push("index.html");
  else {
    candidates.push(normalized);
    if (normalized.endsWith("/")) candidates.push(`${normalized}index.html`);
    else candidates.push(`${normalized}/index.html`);
  }

  for (const candidate of candidates) {
    const absolutePath = path.resolve(buildDir, candidate);
    if (!absolutePath.startsWith(`${buildDir}${path.sep}`) && absolutePath !== buildDir) continue;
    const info = await fileInfo(absolutePath);
    if (info) return { absolutePath, relativePath: candidate, size: info.size };
  }
  return undefined;
}

async function fileInfo(filePath) {
  try {
    const info = await stat(filePath);
    return info.isFile() ? info : undefined;
  } catch {
    return undefined;
  }
}

function normalizeRequestPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return undefined;
  }
  if (decoded.includes("\0") || decoded.includes("\\") || decoded.split("/").includes("..")) return undefined;
  return decoded.replace(/^\/+/u, "");
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".map": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2"
  }[ext] ?? "application/octet-stream";
}

function cacheControlFor(filePath) {
  return filePath.includes("/assets/") ? "public, max-age=31536000, immutable" : "no-cache";
}

function positiveInteger(value) {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}
