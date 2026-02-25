import StyleDictionary from 'style-dictionary';
import { transforms } from 'style-dictionary/enums';
import { copyFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const {
  attributeCti,
  timeSeconds,
  htmlIcon,
  sizeRem,
  sizeRemToSp,
  sizeRemToDp,
  sizeSwiftRemToCGFloat,
  colorCss,
  colorHex8android,
  colorUIColorSwift,
  assetUrl,
  assetSwiftLiteral,
  contentSwiftLiteral,
  fontFamilyCss,
  cubicBezierCss,
  strokeStyleCssShorthand,
  borderCssShorthand,
  typographyCssShorthand,
  transitionCssShorthand,
  shadowCssShorthand,
} = transforms;

const projectRoot = join(__dirname, '..');
const outputPath = join(projectRoot, 'src');
const tokensRoot = join(projectRoot, 'src/tokens');
const useNewTokens = existsSync(join(tokensRoot, '$metadata.json'));

function getSources(theme, brand) {
  if (useNewTokens) {
    return [
      join(tokensRoot, 'core.json'),
      join(tokensRoot, 'global/**/*.json'),
      join(tokensRoot, 'components/**/*.json'),
      join(tokensRoot, `mode/${theme}.json`),
    ];
  }

  return [
    join(tokensRoot, 'base/*.json'),
    join(tokensRoot, `semantic/${theme}.json`),
    join(tokensRoot, `brands/${brand}/${theme}.json`),
  ];
}

function toCamelFromPath(path = []) {
  const name = path
    .map((part, index) => {
      const cleaned = part
        .toString()
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .trim()
        .replace(/\s+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase())
        .replace(/\s+/g, '');
      if (index === 0) return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    })
    .join('');
  return /^\d/.test(name) ? `token${name}` : name;
}

function toKebabFromPath(path = []) {
  return path
    .map((part) =>
      part
        .toString()
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase()
    )
    .join('-');
}

function evaluateMathValue(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!/[0-9]/.test(trimmed) || !/[+\-*/]/.test(trimmed)) return value;
  if (/[^0-9+\-*/().\s]/.test(trimmed)) return value;
  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${trimmed});`)();
    if (Number.isFinite(result)) return String(result);
  } catch {
    return value;
  }
  return value;
}

function applyUnitIfNeeded(token, value) {
  if (typeof value !== 'string') return value;
  const numeric = /^-?\d+(\.\d+)?$/.test(value.trim());
  if (!numeric) return value;

  const type = token.$type || token.type;
  const unitTypes = new Set([
    'dimension',
    'spacing',
    'borderWidth',
    'borderRadius',
    'sizing',
    'fontSizes',
  ]);

  if (unitTypes.has(type)) {
    return `${value}px`;
  }

  return value;
}

async function buildTheme(theme, brand = 'default') {
  const cssFiles = [
    {
      destination: `variables-${brand}-${theme}.css`,
      format: 'css/variables-path',
      options: {
        selector: `[data-theme="${brand}-${theme}"]`
      }
    },
  ];

  if (brand === 'default' && theme === 'light') {
    cssFiles.push({
      destination: 'variables.css',
      format: 'css/variables-path',
      options: {
        selector: ':root'
      }
    });
  }

  const sd = new StyleDictionary({
    usesDtcg: true,
    log: {
      verbosity: process.argv.includes('--verbose') ? 'verbose' : 'default'
    },
    source: getSources(theme, brand),
    hooks: {
      formats: {
        'css/variables-path': async ({ dictionary, options }) => {
          const selector = options?.selector ?? ':root';
          const lines = dictionary.allTokens.map((token) => {
            const name = toKebabFromPath(token.path ?? [token.name ?? 'token']);
            const rawValue = options?.usesDtcg ? token.$value : token.value;
            const evaluated = evaluateMathValue(rawValue);
            const withUnit = applyUnitIfNeeded(token, evaluated);
            const value = typeof withUnit === 'string' ? withUnit : JSON.stringify(withUnit);
            const comment = token.$description || token.comment;
            return comment ? `  --${name}: ${value}; /** ${comment} */` : `  --${name}: ${value};`;
          });
          return [
            '/**',
            ' * Do not edit directly, this file was auto-generated.',
            ' */',
            '',
            `${selector} {`,
            ...lines,
            '}',
            '',
          ].join('\n');
        },
        'scss/variables-path': async ({ dictionary }) => {
          const lines = dictionary.allTokens.map((token) => {
            const name = toKebabFromPath(token.path ?? [token.name ?? 'token']);
            const evaluated = evaluateMathValue(token.$value ?? token.value);
            const withUnit = applyUnitIfNeeded(token, evaluated);
            const value = typeof withUnit === 'string' ? withUnit : JSON.stringify(withUnit);
            const comment = token.$description || token.comment;
            return comment ? `$${name}: ${value}; /** ${comment} */` : `$${name}: ${value};`;
          });
          return [
            '/**',
            ' * Do not edit directly, this file was auto-generated.',
            ' */',
            '',
            ...lines,
            '',
          ].join('\n');
        },
        'ts/es6-safe': async ({ dictionary, options }) => {
          const lines = dictionary.allTokens.map((token) => {
            const name = toCamelFromPath(token.path ?? [token.name ?? 'token']);
            const rawValue = options.usesDtcg ? token.$value : token.value;
            const evaluated = evaluateMathValue(rawValue);
            const value = JSON.stringify(evaluated);
            return `export const ${name} = ${value};`;
          });
          return lines.join('\n');
        },
        'ts/es6-declarations-safe': async ({ dictionary }) => {
          const lines = dictionary.allTokens.map((token) => {
            const name = toCamelFromPath(token.path ?? [token.name ?? 'token']);
            return `export const ${name}: string;`;
          });
          return lines.join('\n');
        },
      },
      transforms: {
        'name/path/camel': {
          type: 'name',
          transform: (token) => {
            return toCamelFromPath(token.path);
          },
        },
        'name/path/kebab': {
          type: 'name',
          transform: (token) => {
            return token.path
              .map((part) =>
                part
                  .toString()
                  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
                  .replace(/[^a-zA-Z0-9]+/g, '-')
                  .replace(/-+/g, '-')
                  .toLowerCase()
              )
              .join('-');
          },
        },
        'name/path/snake': {
          type: 'name',
          transform: (token) => {
            return token.path
              .map((part) =>
                part
                  .toString()
                  .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
                  .replace(/[^a-zA-Z0-9]+/g, '_')
                  .replace(/_+/g, '_')
                  .toLowerCase()
              )
              .join('_');
          },
        },
        'value/math': {
          type: 'value',
          transform: (token) => {
            return evaluateMathValue(token.value);
          },
        },
      },
    },
    platforms: {
      css: {
        transforms: [
          attributeCti,
          'name/path/kebab',
          timeSeconds,
          htmlIcon,
          sizeRem,
          colorCss,
          assetUrl,
          fontFamilyCss,
          cubicBezierCss,
          strokeStyleCssShorthand,
          borderCssShorthand,
          typographyCssShorthand,
          transitionCssShorthand,
          shadowCssShorthand,
          'value/math',
        ],
        buildPath: join(outputPath, 'generated/css/'),
        files: cssFiles,
      },
      scss: {
        transforms: [
          attributeCti,
          'name/path/kebab',
          timeSeconds,
          htmlIcon,
          sizeRem,
          colorCss,
          assetUrl,
          fontFamilyCss,
          cubicBezierCss,
          strokeStyleCssShorthand,
          borderCssShorthand,
          typographyCssShorthand,
          transitionCssShorthand,
          shadowCssShorthand,
          'value/math',
        ],
        buildPath: join(outputPath, 'generated/scss/'),
        files: [
          {
            destination: `variables-${brand}-${theme}.scss`,
            format: 'scss/variables-path',
          },
        ],
      },
      ts: {
        transforms: ['attribute/cti', 'name/path/camel', 'value/math', 'size/rem', 'color/hex'],
        buildPath: join(outputPath, 'generated/ts/'),
        files: [
          {
            destination: `tokens-${brand}-${theme}.ts`,
            format: 'ts/es6-safe',
          },
          {
            destination: `tokens-${brand}-${theme}.d.ts`,
            format: 'ts/es6-declarations-safe',
          },
        ],
      },
      android: {
        transforms: [
          attributeCti,
          'name/path/snake',
          colorHex8android,
          sizeRemToSp,
          sizeRemToDp,
          'value/math',
        ],
        buildPath: join(outputPath, 'generated/android/'),
        files: [
          {
            destination: `colors-${brand}-${theme}.xml`,
            format: 'android/colors',
            filter: (token) => token.$type === 'color',
          },
          {
            destination: `dimens-${brand}-${theme}.xml`,
            format: 'android/dimens',
            filter: (token) => token.$type === 'dimension',
          }
        ],
      },
      'ios-swift': {
        transforms: [
          attributeCti,
          'name/path/camel',
          colorUIColorSwift,
          contentSwiftLiteral,
          assetSwiftLiteral,
          sizeSwiftRemToCGFloat,
          'value/math',
        ],
        buildPath: join(outputPath, 'generated/ios/'),
        files: [
          {
            destination: `Tokens-${brand.charAt(0).toUpperCase() + brand.slice(1)}${theme.charAt(0).toUpperCase() + theme.slice(1)}.swift`,
            format: 'ios-swift/class.swift',
            className: `Tokens${brand.charAt(0).toUpperCase() + brand.slice(1)}${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
          },
        ],
      },
    },
  });

  console.log(`Building ${brand}/${theme}...`);
  await sd.buildAllPlatforms();
}

(async () => {
  try {
    console.log('Build started...');
    await buildTheme('light', 'default');
    await buildTheme('dark', 'default');
    await buildTheme('light', 'purple');
    await buildTheme('dark', 'purple');

    // Expose the default light tokens at the package root for consumers.
    const sourceTs = join(outputPath, 'generated/ts/tokens-default-light.ts');
    const sourceDts = join(outputPath, 'generated/ts/tokens-default-light.d.ts');
    const targetTs = join(outputPath, 'generated/ts/tokens.ts');
    const targetDts = join(outputPath, 'generated/ts/tokens.d.ts');
    await copyFile(sourceTs, targetTs);
    await copyFile(sourceDts, targetDts);

    console.log('\nBuild completed!');
  } catch (e) {
    console.error('Build failed:', e);
    process.exit(1);
  }
})();
