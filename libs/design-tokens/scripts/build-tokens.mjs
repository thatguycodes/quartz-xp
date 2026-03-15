/*
Copyright © 2025 The Sage Group plc or its licensors. All Rights reserved
 */

import * as fs from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { StyleDictionary, groups } from "./style-dictionary.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const projectRoot = join(__dirname, "..")
const tokensRoot = join(projectRoot, "src/tokens")
const outputPath = join(projectRoot, "src/generated")

// Shared primitive sources (raw color palette)
const primitiveSources = [
  join(tokensRoot, "brands/quartz/primitives.json"),
  join(tokensRoot, "global/*.json"),
]

/**
 * Build a Style Dictionary config for a named token set.
 * @param {string} name - Output file name (without extension)
 * @param {string[]} sources - Source JSON file paths
 * @param {string} selector - CSS selector for custom properties
 */
function buildConfig({ name, sources, selector = ":root" }) {
  return {
    source: sources,
    platforms: {
      css: {
        buildPath: join(outputPath, "css/"),
        transforms: groups.css,
        files: [
          {
            destination: `${name}.css`,
            format: "css/variables",
            options: { outputReferences: false, selector },
          },
        ],
      },
      scss: {
        buildPath: join(outputPath, "scss/"),
        transforms: groups.scss,
        files: [
          {
            destination: `${name}.scss`,
            format: "scss/variables",
            options: { outputReferences: false },
          },
        ],
      },
      js: {
        buildPath: join(outputPath, "js/"),
        transforms: groups.js,
        files: [
          {
            destination: `es6/${name}.js`,
            format: "javascript/es6",
            options: { outputReferences: false },
          },
          {
            destination: `es6/${name}.d.ts`,
            format: "typescript/es6-declarations",
            options: { outputReferences: false },
          },
          {
            destination: `common/${name}.js`,
            format: "javascript/module",
            options: { outputReferences: false },
          },
          {
            destination: `common/${name}.d.ts`,
            format: "typescript/module-declarations",
            options: { outputReferences: false },
          },
        ],
      },
      json: {
        buildPath: join(outputPath, "json/"),
        transforms: groups.json,
        files: [
          {
            destination: `${name}.json`,
            format: "json/flat",
            options: { outputReferences: false },
          },
        ],
      },
    },
    log: {
      warnings: "warn",
      verbosity: "verbose",
      errors: { brokenReferences: "throw" },
    },
  }
}

// 1. Build primitives — raw color palette (brand + storm + smoke)
const primitivesSD = new StyleDictionary(
  buildConfig({ name: "primitives", sources: primitiveSources, selector: ":root" })
)
await primitivesSD.buildAllPlatforms()

// 2. Build light theme — primitives + semantics + light overrides
const lightSD = new StyleDictionary(
  buildConfig({
    name: "light",
    sources: [
      ...primitiveSources,
      join(tokensRoot, "brands/quartz/semantics.json"),
      join(tokensRoot, "themes/light.json"),
    ],
    selector: "[data-theme=\"light\"]",
  })
)
await lightSD.buildAllPlatforms()

// 3. Build dark theme — primitives + semantics + dark overrides
const darkSD = new StyleDictionary(
  buildConfig({
    name: "dark",
    sources: [
      ...primitiveSources,
      join(tokensRoot, "brands/quartz/semantics.json"),
      join(tokensRoot, "themes/dark.json"),
    ],
    selector: "[data-theme=\"dark\"]",
  })
)
await darkSD.buildAllPlatforms()

// Generate CSS bundle that imports all token files
try {
  const bundleContent = [
    "/** Auto-generated CSS bundle — import this to get all token layers */",
    '@import "./primitives.css";',
    '@import "./light.css";',
    '@import "./dark.css";',
  ].join("\n")

  fs.writeFileSync(join(outputPath, "css/bundle.css"), bundleContent)
  console.log("Generated CSS bundle at generated/css/bundle.css")
} catch (e) {
  console.warn("Failed to generate CSS bundle:", e.message)
}

// Expose light tokens as the default package entry point
try {
  const sourceJs = join(outputPath, "js/es6/light.js")
  const sourceDts = join(outputPath, "js/es6/light.d.ts")
  const targetJs = join(outputPath, "js/es6/tokens.js")
  const targetDts = join(outputPath, "js/es6/tokens.d.ts")

  if (fs.existsSync(sourceJs)) {
    fs.copyFileSync(sourceJs, targetJs)
    fs.copyFileSync(sourceDts, targetDts)
    console.log("Exposed light tokens at generated/js/es6/tokens.js")
  }
} catch (e) {
  console.warn("Failed to expose light tokens:", e.message)
}