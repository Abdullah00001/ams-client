import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";
import { config } from "./config.mjs";

const supportedTypes = new Set(["color", "dimension", "fontWeight", "fontFamily"]);
const provenanceValues = new Set(["CONFIRMED", "OBSERVED", "ASSUMED", "UNVERIFIED"]);
const referencePattern = /\{([^{}]+)\}/g;
const aliasPattern = /^\{([^{}]+)\}$/;
const colorPattern = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const dimensionPattern = /^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vh|vw)$/;
const fontWeightPattern = /^(?:[1-9]\d{0,2}|1000)$/;

function listJsonFiles(directory) {
  if (!fs.existsSync(directory)) {
    throw new Error(`Token source directory '${directory}' does not exist.`);
  }

  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listJsonFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function referencesIn(value) {
  if (typeof value !== "string") return [];
  return [...value.matchAll(referencePattern)].map((match) => match[1]);
}

function cssPropertyName(tokenPath) {
  const kebabPath = tokenPath.map((segment) =>
    segment
      .replace(/([a-z\d])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase(),
  );
  return `--ams-${kebabPath.join("-")}`;
}

function validateRawValue(token, tokenPath, sourceFile, isSemantic) {
  const { $type: type, $value: value } = token;
  const tokenLabel = `'${tokenPath}' in '${sourceFile}'`;
  const alias = typeof value === "string" && aliasPattern.test(value);

  if (alias) return;

  if (isSemantic) {
    throw new Error(`Semantic token ${tokenLabel} must use a DTCG alias, not a raw value.`);
  }

  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Token ${tokenLabel} must have a non-empty string $value.`);
  }

  const isValid =
    (type === "color" && colorPattern.test(value)) ||
    (type === "dimension" && dimensionPattern.test(value)) ||
    (type === "fontWeight" && fontWeightPattern.test(value)) ||
    (type === "fontFamily" && value.trim().length > 0);

  if (!isValid) {
    throw new Error(`Token ${tokenLabel} has an unsupported ${type} value '${value}'.`);
  }
}

function validateLeaf(token, tokenPath, sourceFile, isSemantic, tokens, cssProperties) {
  const label = `'${tokenPath}' in '${sourceFile}'`;

  if (token.$value === undefined || token.$value === null || token.$value === "") {
    throw new Error(`Token ${label} has an empty or missing $value.`);
  }
  if (typeof token.$type !== "string" || !supportedTypes.has(token.$type)) {
    throw new Error(`Token ${label} has an unsupported or missing $type.`);
  }
  if (typeof token.$description !== "string" || token.$description.trim() === "") {
    throw new Error(`Token ${label} is missing the required $description.`);
  }

  const provenance = token.$extensions?.ams?.provenance;
  if (typeof provenance !== "string" || !provenanceValues.has(provenance)) {
    throw new Error(`Token ${label} has missing or invalid $extensions.ams.provenance.`);
  }

  validateRawValue(token, tokenPath, sourceFile, isSemantic);

  if (tokens.has(tokenPath)) {
    throw new Error(
      `Duplicate token path '${tokenPath}' in '${sourceFile}' and '${tokens.get(tokenPath).sourceFile}'.`,
    );
  }

  const propertyName = cssPropertyName(tokenPath.split("."));
  if (cssProperties.has(propertyName)) {
    throw new Error(
      `Duplicate generated CSS property '${propertyName}' from '${tokenPath}' and '${cssProperties.get(propertyName)}'.`,
    );
  }

  tokens.set(tokenPath, {
    references: referencesIn(token.$value),
    sourceFile,
  });
  cssProperties.set(propertyName, tokenPath);
}

function validateTree(node, currentPath, sourceFile, isSemantic, tokens, cssProperties) {
  if (typeof node !== "object" || node === null || Array.isArray(node)) {
    throw new Error(
      `Token group '${currentPath.join(".") || "root"}' in '${sourceFile}' must be an object.`,
    );
  }

  if (Object.hasOwn(node, "$value")) {
    validateLeaf(node, currentPath.join("."), sourceFile, isSemantic, tokens, cssProperties);
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw new Error(
        `Token group '${[...currentPath, key].join(".")}' in '${sourceFile}' must contain a DTCG token object.`,
      );
    }
    validateTree(value, [...currentPath, key], sourceFile, isSemantic, tokens, cssProperties);
  }
}

function validateReferences(tokens) {
  for (const [tokenPath, token] of tokens) {
    for (const target of token.references) {
      if (!tokens.has(target)) {
        throw new Error(`Token '${tokenPath}' references missing token '${target}'.`);
      }
    }
  }

  const visiting = new Set();
  const visited = new Set();

  function visit(tokenPath, chain) {
    if (visiting.has(tokenPath)) {
      throw new Error(`Circular token reference detected: ${[...chain, tokenPath].join(" -> ")}.`);
    }
    if (visited.has(tokenPath)) return;

    visiting.add(tokenPath);
    for (const target of tokens.get(tokenPath).references) {
      visit(target, [...chain, tokenPath]);
    }
    visiting.delete(tokenPath);
    visited.add(tokenPath);
  }

  for (const tokenPath of tokens.keys()) visit(tokenPath, []);
}

function configForSource(sourceDir) {
  return {
    ...config,
    source: [path.join(sourceDir, "**/*.json")],
  };
}

function validateGeneratedOutput(output) {
  if (!output.includes(":root")) {
    throw new Error("Style Dictionary generated no CSS custom-property root block.");
  }
  if (
    output.includes("undefined") ||
    output.includes("[object Object]") ||
    /\{[a-z][\w.-]*\}/i.test(output)
  ) {
    throw new Error("Generated CSS contains an unresolved token value.");
  }

  const declarations = new Set(
    [...output.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map((match) => match[1]),
  );
  const references = [...output.matchAll(/var\(\s*(--[\w-]+)/g)].map((match) => match[1]);
  for (const reference of references) {
    if (!declarations.has(reference)) {
      throw new Error(`Generated CSS contains unresolved reference '${reference}'.`);
    }
  }
}

export async function checkTokens({
  sourceDir = path.resolve(process.cwd(), "tokens/src"),
  generatedPath = path.resolve(process.cwd(), "src/styles/tokens.css"),
} = {}) {
  const files = listJsonFiles(sourceDir);
  if (files.length === 0) {
    throw new Error(`No token JSON files found under '${sourceDir}'.`);
  }

  const tokens = new Map();
  const cssProperties = new Map();

  for (const file of files) {
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (error) {
      throw new Error(`Invalid JSON syntax in '${file}': ${error.message}`);
    }

    const isSemantic = path.relative(sourceDir, file).split(path.sep)[0] === "semantics";
    validateTree(parsed, [], file, isSemantic, tokens, cssProperties);
  }

  validateReferences(tokens);

  let output;
  try {
    const sd = new StyleDictionary(configForSource(sourceDir));
    await sd.hasInitialized;
    const formatted = await sd.formatPlatform("css");
    output = formatted.find((file) => file.destination.endsWith("tokens.css"))?.output;
  } catch (error) {
    throw new Error(`Failed compiling tokens in memory: ${error.message}`);
  }

  if (!output) {
    throw new Error("Style Dictionary produced no output for tokens.css.");
  }
  validateGeneratedOutput(output);

  if (!fs.existsSync(generatedPath)) {
    throw new Error(
      `Generated CSS file '${generatedPath}' does not exist. Run 'pnpm tokens:build'.`,
    );
  }

  if (fs.readFileSync(generatedPath, "utf8") !== output) {
    throw new Error(
      `Generated CSS file '${generatedPath}' is stale or does not match token sources. Run 'pnpm tokens:build'.`,
    );
  }

  return { sourceFiles: files.length, tokenCount: tokens.size };
}

async function runCheck() {
  const result = await checkTokens();
  console.log(
    `✔ Token check passed: ${result.tokenCount} tokens across ${result.sourceFiles} source files are valid and generated CSS is up to date.`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runCheck().catch((error) => {
    console.error(`✖ Token check failed: ${error.message}`);
    process.exitCode = 1;
  });
}
