import StyleDictionary from 'style-dictionary';
import { copyFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const outputPath = join(projectRoot, 'src');

async function buildTheme(theme, brand = 'default') {
  const cssFiles = [
    {
      destination: `variables-${brand}-${theme}.css`,
      format: 'css/variables',
      options: {
        selector: `[data-theme="${brand}-${theme}"]`
      }
    },
  ];

  if (brand === 'default' && theme === 'light') {
    cssFiles.push({
      destination: 'variables.css',
      format: 'css/variables',
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
    source: [
      join(projectRoot, 'src/tokens/base/*.json'),
      join(projectRoot, `src/tokens/semantic/${theme}.json`),
      join(projectRoot, `src/tokens/brands/${brand}/${theme}.json`),
    ],
    hooks: {
      transforms: {
        'name/cti/camel': {
          type: 'name',
          transform: (token) => {
            return token.path
              .map((part, index) => {
                const camelPart = part.replace(/[-_]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
                if (index === 0) return camelPart;
                return camelPart.charAt(0).toUpperCase() + camelPart.slice(1);
              })
              .join('');
          },
        }
      }
    },
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: join(outputPath, 'generated/css/'),
        files: cssFiles,
      },
      scss: {
        transformGroup: 'scss',
        buildPath: join(outputPath, 'generated/scss/'),
        files: [
          {
            destination: `variables-${brand}-${theme}.scss`,
            format: 'scss/variables',
          },
        ],
      },
      ts: {
        transforms: ['attribute/cti', 'name/cti/camel', 'size/rem', 'color/hex'],
        buildPath: join(outputPath, 'generated/ts/'),
        files: [
          {
            destination: `tokens-${brand}-${theme}.ts`,
            format: 'javascript/es6',
          },
          {
            destination: `tokens-${brand}-${theme}.d.ts`,
            format: 'typescript/es6-declarations',
          },
        ],
      },
      android: {
        transformGroup: 'android',
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
        transformGroup: 'ios-swift',
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
