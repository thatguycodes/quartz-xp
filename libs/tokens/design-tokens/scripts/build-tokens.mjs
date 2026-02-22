import StyleDictionary from 'style-dictionary';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
// Output to src directory so tokens are part of the source code
const outputPath = join(projectRoot, 'src');

(async () => {
    try {
        const sd = new StyleDictionary({
            source: [join(projectRoot, 'src/tokens/**/*.json')],
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
                    files: [
                        {
                            destination: 'variables.css',
                            format: 'css/variables',
                        },
                    ],
                },
                ts: {
                    transforms: ['attribute/cti', 'name/cti/camel', 'size/rem', 'color/hex'],
                    buildPath: join(outputPath, 'generated/ts/'),
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

        await sd.buildAllPlatforms();
        console.log('\nBuild completed!');
    } catch (e) {
        console.error('Build failed:', e);
        process.exit(1);
    }
})();
