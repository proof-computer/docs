#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.resolve(rootDir, stringFlag("--manifest") ?? ".slipway/dist/proof-docs-acurast-manifest.json");
const audience = nonEmptyEnv("SLIPWAY_ARTIFACT_PIN_AUDIENCE") ?? "slipway-artifact-pin";
const urlTemplate = nonEmptyEnv("SLIPWAY_ARTIFACT_PIN_URL") ?? "https://liskov.proof.computer/api/applications/{applicationId}/artifact-pins/github";
const applicationIds = (nonEmptyEnv("SLIPWAY_APPLICATION_IDS") ?? "proof-docs")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const json = process.argv.includes("--json");

if (applicationIds.length === 0) throw new Error("SLIPWAY_APPLICATION_IDS must include at least one Application id");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const scriptCid = stringField(manifest, "scriptIpfs") ?? stringField(manifest, "scriptCid");
const bundleDigest = stringField(manifest, "scriptHash") ?? prefixedSha256(stringField(manifest, "bundleSha256"));
if (!scriptCid) throw new Error(`Manifest ${manifestPath} is missing scriptIpfs`);
if (!bundleDigest) throw new Error(`Manifest ${manifestPath} is missing scriptHash or bundleSha256`);

const token = await githubOidcToken(audience);
const results = [];
for (const applicationId of applicationIds) {
  const url = urlTemplate.replaceAll("{applicationId}", encodeURIComponent(applicationId));
  const body = {
    domain: "proof.slipway.github-artifact-pin.v1",
    applicationId,
    scriptCid,
    bundleDigest,
    generatedAt: stringField(manifest, "generatedAt") ?? new Date().toISOString(),
    encryption: {
      mode: "none"
    },
    provenance: {
      repository: requiredEnv("GITHUB_REPOSITORY"),
      ref: requiredEnv("GITHUB_REF"),
      sha: requiredEnv("GITHUB_SHA"),
      workflow: process.env.GITHUB_WORKFLOW,
      workflow_ref: process.env.GITHUB_WORKFLOW_REF,
      run_id: process.env.GITHUB_RUN_ID,
      run_attempt: process.env.GITHUB_RUN_ATTEMPT,
      actor: process.env.GITHUB_ACTOR,
      event_name: process.env.GITHUB_EVENT_NAME
    }
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/json",
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`Slipway artifact pin post failed for ${applicationId}: ${response.status} ${redactResponse(responseText)}`);
  }
  results.push(summarizePinResult(JSON.parse(responseText), applicationId));
}

const output = {
  ok: true,
  applicationIds,
  posted: results.length,
  scriptCid,
  bundleDigest,
  results
};
console.log(json ? JSON.stringify(output, null, 2) : `Posted ${results.length} Slipway artifact pin(s) for ${applicationIds.join(", ")}`);

async function githubOidcToken(tokenAudience) {
  const requestUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  const requestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if (!requestUrl || !requestToken) {
    throw new Error("GitHub OIDC request env is missing; ensure workflow permissions include id-token: write");
  }
  const url = new URL(requestUrl);
  url.searchParams.set("audience", tokenAudience);
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${requestToken}`,
      accept: "application/json"
    }
  });
  if (!response.ok) throw new Error(`GitHub OIDC token request failed: ${response.status} ${await response.text()}`);
  const body = await response.json();
  if (typeof body.value !== "string" || body.value.length === 0) throw new Error("GitHub OIDC token response did not include value");
  return body.value;
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function nonEmptyEnv(name) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
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

function stringField(record, field) {
  const value = record[field];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function prefixedSha256(value) {
  return value ? `sha256:${value.replace(/^sha256:/u, "")}` : undefined;
}

function summarizePinResult(result, fallbackApplicationId) {
  const pin = objectField(result, "pin");
  const draft = objectField(result, "draft");
  const policy = objectField(result, "policy");
  const pinArtifact = objectField(pin, "artifact");
  const draftArtifact = objectField(draft, "artifact");
  const policyArtifact = objectField(policy, "artifact");
  return {
    applicationId: stringField(result, "applicationId") ?? fallbackApplicationId,
    pinId: stringField(pin, "pinId"),
    autoPublished: booleanField(pin, "autoPublished"),
    publishedPolicyVersionId: stringField(pin, "publishedPolicyVersionId"),
    scriptCid: stringField(pin, "scriptCid") ?? stringField(pinArtifact, "cid") ?? stringField(policy, "scriptCid"),
    bundleDigest: stringField(pinArtifact, "digest") ?? bundleDigest,
    draft: summarizePolicyLike(draft, draftArtifact),
    policy: summarizePolicyLike(policy, policyArtifact)
  };
}

function summarizePolicyLike(value, artifact) {
  if (!value) return undefined;
  return {
    policyVersionId: stringField(value, "policyVersionId"),
    policyDigest: stringField(value, "policyDigest"),
    artifactStatus: stringField(artifact, "status"),
    artifactCid: stringField(artifact, "cid"),
    artifactDigest: stringField(artifact, "digest")
  };
}

function objectField(record, field) {
  const value = record?.[field];
  return value && typeof value === "object" && !Array.isArray(value) ? value : undefined;
}

function booleanField(record, field) {
  const value = record?.[field];
  return typeof value === "boolean" ? value : undefined;
}

function redactResponse(value) {
  return value.replace(/[A-Za-z0-9_-]{24,}/gu, "[redacted]").slice(0, 400);
}
