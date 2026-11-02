#!/usr/bin/env node

/**
 * @fileoverview Feature Scaffolding Script
 * Automates creating Feature-Sliced Design modules with:
 * - components/ (<feature>-view.tsx, index.ts)
 * - hooks/ (use-<feature>.ts, index.ts)
 * - lib/ (<feature>-utils.ts, index.ts)
 * - services/ (<feature>.service.ts, index.ts)
 * - styles/ (<feature>-view.module.css)
 * - types/ (<feature>.types.ts, index.ts)
 * - index.ts (feature public entrypoint)
 *
 * Usage:
 *   npm run create:feature <feature-name>
 *   pnpm create:feature <feature-name>
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const FEATURES_DIR = path.join(ROOT_DIR, "src", "features");

// Utility case converters
function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "");
}

function toPascalCase(str) {
  return toKebabCase(str)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toTitleCase(str) {
  return toKebabCase(str)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// 1. Parse command-line arguments
const rawArgs = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
const featureInput = rawArgs[0];

if (!featureInput) {
  console.error("\x1b[31m%s\x1b[0m", "❌ Error: Feature name is required.");
  console.log("\nUsage:\n  npm run create:feature <feature_name>\n  pnpm create:feature <feature_name>\n");
  console.log("Examples:\n  npm run create:feature student-management\n  pnpm create:feature fee_structure\n");
  process.exit(1);
}

const kebabName = toKebabCase(featureInput);
const pascalName = toPascalCase(featureInput);
const camelName = toCamelCase(featureInput);
const titleName = toTitleCase(featureInput);

const targetDir = path.join(FEATURES_DIR, kebabName);

if (fs.existsSync(targetDir)) {
  console.error("\x1b[31m%s\x1b[0m", `❌ Error: Feature directory already exists at src/features/${kebabName}`);
  process.exit(1);
}

// 2. Define Template Contents
const templates = {
  // Types
  types: `/**
 * @fileoverview ${titleName} Domain Types
 * @module features/${kebabName}/types
 */

export interface ${pascalName}Item {
  id: string;
  name: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface ${pascalName}State {
  items: ${pascalName}Item[];
  isLoading: boolean;
  error: string | null;
}
`,

  typesIndex: `/**
 * @fileoverview ${titleName} Types Entrypoint
 * @module features/${kebabName}/types
 */

export * from "./${kebabName}.types";
`,

  // Services
  service: `/**
 * @fileoverview ${titleName} Service Layer
 * @module features/${kebabName}/services
 */

import type { ${pascalName}Item } from "../types";

/**
 * Fetches ${titleName} data items with simulated latency.
 */
export async function get${pascalName}Items(): Promise<${pascalName}Item[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: "1",
      name: "Sample ${titleName} Item",
      status: "active",
      createdAt: new Date().toISOString(),
    },
  ];
}
`,

  servicesIndex: `/**
 * @fileoverview ${titleName} Services Entrypoint
 * @module features/${kebabName}/services
 */

export * from "./${kebabName}.service";
`,

  // Lib
  libUtils: `/**
 * @fileoverview ${titleName} Utilities
 * @module features/${kebabName}/lib
 */

/**
 * Formats a ${titleName} display name.
 */
export function format${pascalName}Name(name: string): string {
  return name.trim();
}
`,

  libIndex: `/**
 * @fileoverview ${titleName} Lib Entrypoint
 * @module features/${kebabName}/lib
 */

export * from "./${kebabName}-utils";
`,

  // Hooks
  hook: `/**
 * @fileoverview ${titleName} Custom Hook
 * @module features/${kebabName}/hooks/use-${kebabName}
 */

"use client";

import { useEffect, useState } from "react";
import type { ${pascalName}Item } from "../types";
import { get${pascalName}Items } from "../services";

export function use${pascalName}() {
  const [items, setItems] = useState<${pascalName}Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        const data = await get${pascalName}Items();
        if (mounted) {
          setItems(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load ${camelName} data");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    items,
    isLoading,
    error,
  };
}
`,

  hooksIndex: `/**
 * @fileoverview ${titleName} Hooks Entrypoint
 * @module features/${kebabName}/hooks
 */

export * from "./use-${kebabName}";
`,

  // Styles (CSS Module)
  styles: `/**
 * @fileoverview ${titleName} CSS Module
 * @module features/${kebabName}/styles/${kebabName}-view.module.css
 */

.container {
  width: 100%;
  box-sizing: border-box;
  padding: clamp(20px, 3vw, 36px);
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: var(--ams-font-family-sans, Inter, sans-serif);
}

.header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--ams-color-grayscale-400, #071437);
  line-height: 1.3;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--ams-color-text-muted, #99a1b7);
}

.card {
  background-color: var(--ams-color-surface-card, #ffffff);
  border: 1px solid var(--ams-color-border-subtle, #eff1f4);
  border-radius: var(--ams-radius-8, 8px);
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.03);
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
`,

  // Components
  componentView: `/**
 * @fileoverview ${titleName} View Component
 * @module features/${kebabName}/components/${kebabName}-view
 */

"use client";

import { use${pascalName} } from "../hooks";
import styles from "../styles/${kebabName}-view.module.css";

export function ${pascalName}View() {
  const { items, isLoading, error } = use${pascalName}();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>${titleName}</h1>
        <p className={styles.subtitle}>
          Manage and configure your academy ${titleName.toLowerCase()} settings and records.
        </p>
      </header>

      <section className={styles.card}>
        {isLoading ? (
          <p>Loading ${titleName.toLowerCase()} data...</p>
        ) : error ? (
          <p style={{ color: "var(--ams-color-status-error, #f8285a)" }}>{error}</p>
        ) : (
          <div>
            <p>Ready to build atomic components for <strong>${titleName}</strong>.</p>
            <ul>
              {items.map((item) => (
                <li key={item.id}>{item.name} ({item.status})</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
`,

  componentsIndex: `/**
 * @fileoverview ${titleName} Components Entrypoint
 * @module features/${kebabName}/components
 */

export * from "./${kebabName}-view";
`,

  // Feature Root Entrypoint
  featureIndex: `/**
 * @fileoverview ${titleName} Feature Public Module Entrypoint
 * @module features/${kebabName}
 */

export * from "./components";
export * from "./hooks";
export * from "./lib";
export * from "./services";
export * from "./types";
`,
};

// 3. Write Files and Directories
const filesToCreate = [
  { dir: "types", file: `${kebabName}.types.ts`, content: templates.types },
  { dir: "types", file: "index.ts", content: templates.typesIndex },
  { dir: "services", file: `${kebabName}.service.ts`, content: templates.service },
  { dir: "services", file: "index.ts", content: templates.servicesIndex },
  { dir: "lib", file: `${kebabName}-utils.ts`, content: templates.libUtils },
  { dir: "lib", file: "index.ts", content: templates.libIndex },
  { dir: "hooks", file: `use-${kebabName}.ts`, content: templates.hook },
  { dir: "hooks", file: "index.ts", content: templates.hooksIndex },
  { dir: "styles", file: `${kebabName}-view.module.css`, content: templates.styles },
  { dir: "components", file: `${kebabName}-view.tsx`, content: templates.componentView },
  { dir: "components", file: "index.ts", content: templates.componentsIndex },
  { dir: "", file: "index.ts", content: templates.featureIndex },
];

console.log(`\n🚀 Generating feature: \x1b[36m${kebabName}\x1b[0m`);
console.log(`📁 Destination: src/features/${kebabName}\n`);

// Create parent directory
fs.mkdirSync(targetDir, { recursive: true });

for (const item of filesToCreate) {
  const itemDir = item.dir ? path.join(targetDir, item.dir) : targetDir;
  if (!fs.existsSync(itemDir)) {
    fs.mkdirSync(itemDir, { recursive: true });
  }

  const filePath = path.join(itemDir, item.file);
  fs.writeFileSync(filePath, item.content, "utf-8");
  const relPath = path.relative(ROOT_DIR, filePath);
  console.log(`  \x1b[32m✔\x1b[0m Created ${relPath}`);
}

console.log("\n\x1b[32m%s\x1b[0m", `✨ Feature "${kebabName}" successfully created!`);
console.log("\nStructure created:");
console.log(`src/features/${kebabName}/`);
console.log(`├── components/`);
console.log(`│   ├── ${kebabName}-view.tsx`);
console.log(`│   └── index.ts`);
console.log(`├── hooks/`);
console.log(`│   ├── use-${kebabName}.ts`);
console.log(`│   └── index.ts`);
console.log(`├── lib/`);
console.log(`│   ├── ${kebabName}-utils.ts`);
console.log(`│   └── index.ts`);
console.log(`├── services/`);
console.log(`│   ├── ${kebabName}.service.ts`);
console.log(`│   └── index.ts`);
console.log(`├── styles/`);
console.log(`│   └── ${kebabName}-view.module.css`);
console.log(`├── types/`);
console.log(`│   ├── ${kebabName}.types.ts`);
console.log(`│   └── index.ts`);
console.log(`└── index.ts\n`);
