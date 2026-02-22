import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import * as path from 'path';

// Register custom transforms from tokens-studio
register(StyleDictionary);

const projectRoot = path.join(__dirname, '..');
// Update output path to use standard dist folder
const outputPath = path.join(projectRoot, '../../../../dist/libs/tokens/design-tokens');

const sd = new StyleDictionary({
    source: [path.join(projectRoot, 'src/tokens/**/*.json')],
    platforms: {
        css: {
            transformGroup: 'tokens-studio',
            transforms: ['name/kebab'],
            buildPath: path.join(outputPath, 'generated/css/'),
            files: [
                {
                    destination: 'variables.css',
                    format: 'css/variables',
                },
            ],
        },
        ts: {
            transformGroup: 'tokens-studio',
            transforms: ['name/camel'],
            buildPath: path.join(outputPath, 'generated/ts/'),
            files: [
                {
                    destination: 'tokens.ts',
                    format: 'javascript/es6',
                },
                {
                    destination: 'tokens.d.ts',
                    format: 'typescript/es6-declarations',
                },
            ],
        },
    },
});

console.log('Build started...');
sd.buildAllPlatforms();
console.log('\nBuild completed!');
