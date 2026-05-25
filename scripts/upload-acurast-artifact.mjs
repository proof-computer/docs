#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(rootDir, ".slipway", "dist", "proof-docs-acurast-manifest.json");
const defaultAcurastIpfsEndpoint = "https://ipfs-proxy.acurast.prod.gke.papers.tech";
const json = process.argv.includes("--json");
const explicitScriptIpfs = stringFlag("--script-ipfs") ?? nonEmptyString(process.env.ACURAST_SCRIPT_IPFS);

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const bundlePath = path.resolve(rootDir, requiredString(manifest.bundlePath, "manifest.bundlePath"));
const bundle = await readFile(bundlePath);
const bundleSha256 = createHash("sha256").update(bundle).digest("hex");
if (bundleSha256 !== manifest.bundleSha256) {
  throw new Error(`Bundle digest mismatch for ${bundlePath}`);
}

const scriptIpfs = explicitScriptIpfs ?? await uploadDirectIpfs(bundle);
if (!scriptIpfs.startsWith("ipfs://")) throw new Error("Acurast script IPFS URI must start with ipfs://");

const updated = {
  ...manifest,
  scriptIpfs,
  scriptCid: scriptIpfs,
  scriptHash: `sha256:${bundleSha256}`,
  bundleSha256,
  uploadedAt: new Date().toISOString()
};
await writeFile(manifestPath, `${JSON.stringify(updated, null, 2)}\n`, "utf8");

if (json) {
  console.log(JSON.stringify({ ok: true, manifestPath, ...updated }, null, 2));
} else {
  console.log(`Script IPFS: ${scriptIpfs}`);
  console.log(`Bundle sha256: ${bundleSha256}`);
}

async function uploadDirectIpfs(bundle) {
  const endpoint = (nonEmptyString(process.env.ACURAST_IPFS_URL) ?? defaultAcurastIpfsEndpoint).replace(/\/+$/u, "");
  const apiKey = nonEmptyString(process.env.ACURAST_IPFS_API_KEY);
  const body = new FormData();
  body.append("file", new Blob([bundle], { type: "text/javascript" }), "proof-docs-acurast.mjs");
  body.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));
  body.append("pinataMetadata", JSON.stringify({ name: "proof-docs-acurast" }));

  const response = await fetch(`${endpoint}/pinning/pinFileToIPFS`, {
    method: "POST",
    headers: apiKey ? { authorization: `Bearer ${apiKey}` } : undefined,
    body
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`IPFS upload failed with ${response.status}: ${redactResponseSnippet(text)}`);
  const cid = parseIpfsUploadResponse(text);
  if (!cid) throw new Error(`IPFS upload response did not include a CID: ${redactResponseSnippet(text)}`);
  return `ipfs://${cid}`;
}

function parseIpfsUploadResponse(text) {
  try {
    const parsed = JSON.parse(text);
    const value = typeof parsed.IpfsHash === "string" ? parsed.IpfsHash : typeof parsed.Hash === "string" ? parsed.Hash : undefined;
    return value && /^[A-Za-z0-9]+$/u.test(value) ? value : undefined;
  } catch {
    const match = text.match(/ipfs:\/\/([A-Za-z0-9]+)/u);
    return match?.[1];
  }
}

function stringFlag(name) {
  const index = process.argv.indexOf(name);
  if (index >= 0) {
    const value = process.argv[index + 1];
    return value && !value.startsWith("--") ? value : undefined;
  }
  const inline = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return inline?.slice(name.length + 1);
}

function nonEmptyString(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function requiredString(value, field) {
  if (typeof value !== "string" || value.length === 0) throw new Error(`${field} is required`);
  return value;
}

function redactResponseSnippet(value) {
  return value.replace(/[A-Za-z0-9_-]{24,}/gu, "[redacted]").slice(0, 400);
}
