/*
Copyright © 2025 The Sage Group plc or its licensors. All Rights reserved
 */

import * as fs from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { StyleDictionary, groups } from "./style-dictionary.js"
import { FilterComponent } from "./utils/filter-component.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const projectRoot = join(__dirname, "..")
const tokensRoot = join(projectRoot, "src/tokens")
const outputPath = join(projectRoot, "src/generated")

const components = fs.readdirSync(join(tokensRoot, "components"))
const modes = fs.readdirSync(join(tokensRoot, "mode"))

const getMode = ({ modeName = "", format, suffix, subPath }) => {
  const mode = format.includes("variables") ? "" : modeName

  const componentArray = []

  components.forEach((component) => {
    const componentName = component.split(".json")[0]

    if (!componentName) {
      throw new Error(`Component name not found for ${component}`)
    }

    componentArray.push(
      ...getFiles({
        componentName,
        modeName: mode,
        format,
        suffix,
        outputRefs: true,
        subPath,
      })
    )
  })

  return [
    ...getFiles({ componentName: "mode", modeName, format, suffix, subPath }),
    ...componentArray,
  ]
}

const getFormat = (format, outputRefs, componentName) => {
  // outputRefs is true for mode and component files, false for global
  if (format === "json/flat" && outputRefs) {
    return "custom/json-with-refs"
  } else if (
    format === "javascript/es6" &&
    !["mode", "global", "dark", "light"].includes(componentName)
  ) {
    // For component files, use custom ES6 format instead of standard
    return "custom/es6-with-refs"
  } else if (format === "javascript/module") {
    if (["mode", "global", "dark", "light"].includes(componentName)) {
      // For mode/global files we want to have similar export format to ES6 rather nested objects
      return "custom/commonjs-exports"
    } else {
      // For component files, use custom CommonJS format instead of standard
      return "custom/commonjs-with-refs"
    }
  }

  return format
}

const getFiles = ({
  componentName,
  modeName = "",
  format,
  suffix,
  outputRefs = false,
  subPath,
}) => {
  const getPath = (componentName) => {
    let path = ""

    switch (componentName) {
      case "mode":
        path = modeName
        break
      case "global":
        path = "global"
        break
      default:
        path = `components/${componentName}`
    }

    if (subPath) {
      path = join(subPath, path ? path : "")
    }

    return path
  }

  const path = getPath(componentName).trim()
  const actualFormat = getFormat(format, outputRefs, componentName)

  return [
    {
      destination: `${path}.${suffix}`,
      filter: (token) =>
        FilterComponent(token, componentName, format.includes("json")),
      format: actualFormat,
      options: {
        outputReferences: outputRefs,
        selector: componentName === "mode" ? `[data-theme="${modeName}"]` : ":root"
      },
    },
  ]
}

const getGlobalConfig = () => {
  return {
    source: [join(tokensRoot, "core.json"), join(tokensRoot, "global/*.json")],
    // preprocessors: ["tokens-studio"], // Uncomment if tokens-studio is installed
    platforms: {
      css: {
        buildPath: join(outputPath, "css/"),
        transforms: groups.css,
        files: [
          ...getFiles({
            componentName: "global",
            format: "css/variables",
            suffix: "css",
          }),
        ],
      },
      scss: {
        buildPath: join(outputPath, "scss/"),
        transforms: groups.scss,
        files: [
          ...getFiles({
            componentName: "global",
            format: "scss/variables",
            suffix: "scss",
          }),
        ],
      },
      js: {
        buildPath: join(outputPath, "js/"),
        transforms: groups.js,
        files: [
          ...getFiles({
            componentName: "global",
            format: "javascript/module",
            subPath: "common",
            suffix: "js",
          }),
          ...getFiles({
            componentName: "global",
            format: "typescript/module-declarations",
            subPath: "common",
            suffix: "d.ts",
          }),
          ...getFiles({
            componentName: "global",
            format: "javascript/es6",
            subPath: "es6",
            suffix: "js",
          }),
          ...getFiles({
            componentName: "global",
            format: "typescript/es6-declarations",
            subPath: "es6",
            suffix: "d.ts",
          }),
        ],
      },
      json: {
        buildPath: join(outputPath, "json/"),
        transforms: groups.json,
        files: [
          ...getFiles({
            componentName: "global",
            format: "json/flat",
            suffix: "json",
          }),
        ],
      },
    },
    log: {
      warnings: "warn",
      verbosity: "verbose",
      errors: {
        brokenReferences: "throw",
      },
    },
  }
}

const getModeConfig = (modeName) => {
  return {
    source: [
      join(tokensRoot, "core.json"),
      join(tokensRoot, "global/*.json"),
      join(tokensRoot, `mode/${modeName}.json`),
      join(tokensRoot, "components/*.json"),
    ],
    // preprocessors: ["tokens-studio"],
    platforms: {
      css: {
        buildPath: join(outputPath, "css/"),
        transforms: groups.css,
        files: [
          ...getMode({ modeName, format: "css/variables", suffix: "css" }),
        ],
      },
      scss: {
        buildPath: join(outputPath, "scss/"),
        transforms: groups.scss,
        files: [
          ...getMode({ modeName, format: "scss/variables", suffix: "scss" }),
        ],
      },
      js: {
        buildPath: join(outputPath, "js/"),
        transforms: groups.js,
        files: [
          ...getMode({
            modeName,
            format: "javascript/module",
            subPath: "common",
            suffix: "js",
          }),
          ...getMode({
            modeName,
            format: "typescript/module-declarations",
            subPath: "common",
            suffix: "d.ts",
          }),
          ...getMode({
            modeName,
            format: "javascript/es6",
            subPath: "es6",
            suffix: "js",
          }),
          ...getMode({
            modeName,
            format: "typescript/es6-declarations",
            subPath: "es6",
            suffix: "d.ts",
          }),
        ],
      },
      json: {
        buildPath: join(outputPath, "json/"),
        transforms: groups.json,
        files: [
          ...getMode({ modeName, format: "json/flat", suffix: "json" }),
        ],
      },
    },
    log: {
      warnings: "warn",
      verbosity: "verbose",
      errors: {
        brokenReferences: "throw",
      },
    },
  }
}

// Build global tokens
const globalStyleDictionary = new StyleDictionary(getGlobalConfig())

await globalStyleDictionary.buildPlatform("css")
await globalStyleDictionary.buildPlatform("scss")
await globalStyleDictionary.buildPlatform("js")
await globalStyleDictionary.buildPlatform("json")

// Build mode-specific tokens
for (const mode of modes) {
  const modeName = mode.split(".json")[0]

  if (!modeName) {
    throw new Error(`Mode name not found for ${mode}`)
  }

  const modeStyleDictionary = new StyleDictionary(getModeConfig(modeName))

  await modeStyleDictionary.buildPlatform("css")
  await modeStyleDictionary.buildPlatform("scss")
  await modeStyleDictionary.buildPlatform("js")
  await modeStyleDictionary.buildPlatform("json")
}

// Generate a CSS bundle that imports all generated tokens
try {
  const cssPath = join(outputPath, "css")
  const bundlePath = join(cssPath, "bundle.css")
  const componentCssFiles = fs.readdirSync(join(cssPath, "components"))
    .filter(file => file.endsWith(".css"))
    .map(file => `@import "./components/${file}";`)

  const bundleContent = [
    "/** Auto-generated CSS bundle */",
    '@import "./global.css";',
    '@import "./light.css";',
    '@import "./dark.css";',
    ...componentCssFiles
  ].join("\n")

  fs.writeFileSync(bundlePath, bundleContent)
  console.log("Generated CSS bundle at generated/css/bundle.css")
} catch (e) {
  console.warn("Failed to generate CSS bundle:", e.message)
}

// Expose the default light tokens at the package root for consumers (ES6)
try {
  const sourceTs = join(outputPath, "js/es6/light.js")
  const sourceDts = join(outputPath, "js/es6/light.d.ts")
  const targetTs = join(outputPath, "js/es6/tokens.js")
  const targetDts = join(outputPath, "js/es6/tokens.d.ts")

  if (fs.existsSync(sourceTs)) {
    fs.copyFileSync(sourceTs, targetTs)
    fs.copyFileSync(sourceDts, targetDts)
    console.log("Exposed light tokens at generated/js/es6/tokens.js")
  }
} catch (e) {
  console.warn("Failed to expose light tokens:", e.message)
}
