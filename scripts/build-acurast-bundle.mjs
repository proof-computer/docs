#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = path.join(rootDir, "build");
const outDir = path.join(rootDir, ".slipway", "dist");
const bundlePath = path.join(outDir, "proof-docs-acurast.mjs");
const manifestPath = path.join(outDir, "proof-docs-acurast-manifest.json");
const args = new Set(process.argv.slice(2));
const json = args.has("--json");
const skipBuild = args.has("--skip-build");

if (!skipBuild) await run("pnpm", ["build"]);
const files = await collectFiles(buildDir);
if (files.length === 0) throw new Error(`Docusaurus build directory ${buildDir} is empty`);

await mkdir(outDir, { recursive: true });
const bundle = await renderBundle(files);
await writeFile(bundlePath, bundle, "utf8");
const bundleSha256 = createHash("sha256").update(bundle).digest("hex");
const manifest = {
  version: 1,
  kind: "proof-docs-acurast-bundle",
  applicationId: "proof-docs",
  generatedAt: new Date().toISOString(),
  bundlePath: path.relative(rootDir, bundlePath),
  bundleSha256,
  scriptHash: `sha256:${bundleSha256}`,
  entrypoint: "proof-docs-acurast.mjs",
  assetCount: files.length,
  source: {
    repository: process.env.GITHUB_REPOSITORY,
    sha: process.env.GITHUB_SHA
  }
};
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

if (json) {
  console.log(JSON.stringify({ ok: true, manifestPath, ...manifest }, null, 2));
} else {
  console.log(`Acurast bundle: ${path.relative(rootDir, bundlePath)}`);
  console.log(`Bundle sha256: ${bundleSha256}`);
  console.log(`Manifest: ${path.relative(rootDir, manifestPath)}`);
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(absolute));
    } else if (entry.isFile()) {
      const body = await readFile(absolute);
      const relative = path.relative(buildDir, absolute).split(path.sep).join("/");
      files.push({
        path: relative,
        base64: body.toString("base64"),
        contentType: contentTypeFor(relative)
      });
    }
  }
  return files.sort((left, right) => left.path.localeCompare(right.path));
}

async function renderBundle(files) {
  const assets = files.map((file) => [file.path, file.contentType, file.base64]);
  return `#!/usr/bin/env node
import { createServer } from "node:http";
import { Buffer } from "node:buffer";

const ASSETS = new Map(${JSON.stringify(assets)}.map(([assetPath, contentType, base64]) => [
  assetPath,
  { contentType, body: Buffer.from(base64, "base64") }
]));
const port = positiveInteger(process.env.PORT) ?? 3000;
const host = process.env.HOST ?? "0.0.0.0";

const server = createServer((request, response) => {
  try {
    if (request.url === undefined) {
      sendText(response, 400, "bad request");
      return;
    }
    const url = new URL(request.url, "http://localhost");
    if (url.pathname === "/health") {
      const body = Buffer.from(JSON.stringify({ ok: true, service: "proof-docs", checkedAt: new Date().toISOString() }) + "\\n", "utf8");
      response.writeHead(200, {
        "cache-control": "no-store",
        "content-length": String(body.length),
        "content-type": "application/json; charset=utf-8"
      });
      response.end(request.method === "HEAD" ? undefined : body);
      return;
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { allow: "GET, HEAD", "content-type": "text/plain; charset=utf-8" });
      response.end("method not allowed\\n");
      return;
    }
    const asset = resolveAsset(url.pathname);
    if (!asset) {
      sendText(response, 404, "not found");
      return;
    }
    response.writeHead(200, {
      "cache-control": cacheControlFor(asset.path),
      "content-length": String(asset.body.length),
      "content-type": asset.contentType
    });
    response.end(request.method === "HEAD" ? undefined : asset.body);
  } catch (error) {
    sendText(response, 500, error instanceof Error ? error.message : "internal error");
  }
});

server.listen(port, host, () => {
  console.log(\`PROOF docs Acurast bundle listening on http://\${host}:\${port}\`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => server.close(() => process.exit(0)));
}

function resolveAsset(pathname) {
  const normalized = normalizeRequestPath(pathname);
  if (normalized === undefined) return undefined;
  const candidates = normalized === ""
    ? ["index.html"]
    : [normalized, normalized.endsWith("/") ? \`\${normalized}index.html\` : \`\${normalized}/index.html\`];
  for (const candidate of candidates) {
    const asset = ASSETS.get(candidate);
    if (asset) return { path: candidate, ...asset };
  }
  return undefined;
}

function normalizeRequestPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return undefined;
  }
  if (decoded.includes("\\0") || decoded.includes("\\\\") || decoded.split("/").includes("..")) return undefined;
  return decoded.replace(/^\\/+/, "");
}

function sendText(response, status, message) {
  const body = Buffer.from(\`\${message}\\n\`, "utf8");
  response.writeHead(status, {
    "content-length": String(body.length),
    "content-type": "text/plain; charset=utf-8"
  });
  response.end(body);
}

function cacheControlFor(filePath) {
  return filePath.includes("/assets/") ? "public, max-age=31536000, immutable" : "no-cache";
}

function positiveInteger(value) {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}
`;
}

async function run(command, commandArgs) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { cwd: rootDir, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${commandArgs.join(" ")} failed with ${signal ?? code}`));
    });
  });
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
