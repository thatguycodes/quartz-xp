import StyleDictionary from 'style-dictionary';

// Helper functions for transforms (copied from original script)
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
        const result = Function(`"use strict"; return (${trimmed});`)();
        if (Number.isFinite(result)) return String(result);
    } catch {
        return value;
    }
    return value;
}

// Register custom transforms
StyleDictionary.registerTransform({
    name: 'name/path/camel',
    type: 'name',
    transform: (token) => toCamelFromPath(token.path)
});

StyleDictionary.registerTransform({
    name: 'name/path/kebab',
    type: 'name',
    transform: (token) => toKebabFromPath(token.path)
});

StyleDictionary.registerTransform({
    name: 'name/path/snake',
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
    }
});

StyleDictionary.registerTransform({
    name: 'value/math',
    type: 'value',
    transitive: true,
    matcher: (token) => {
        const value = token.value || token.$value;
        if (typeof value !== 'string') return false;
        // Don't transform if it's already a single number or has letters other than px
        const clean = value.replace(/px/g, '').trim();
        const hasOperators = /[+\-*/]/.test(clean);
        const hasNumbers = /[0-9]/.test(clean);
        const hasLetters = /[a-zA-Z]/.test(clean); // If it still has letters after px, skip

        return hasOperators && hasNumbers && !hasLetters;
    },
    transform: (token) => {
        const value = token.value || token.$value;
        if (typeof value !== 'string') return value;
        const clean = value.replace(/px/g, '').trim();
        try {
            const result = Function(`"use strict"; return (${clean});`)();
            if (Number.isFinite(result)) {
                if (result === 0) return "0";

                const type = token.$type || token.type;
                const path = token.path.map(p => p.toLowerCase());

                // Special case: SCALE should always be raw number
                if (path.includes('scale')) return String(result);

                const isSize = ['dimension', 'sizing', 'spacing', 'borderRadius', 'borderWidth'].includes(type) ||
                    path.some(p => ['size', 'space', 'radius', 'borderwidth', 'width', 'height', 'padding', 'margin'].includes(p));

                const final = isSize ? `${result}px` : String(result);
                console.log(`SD_MATH: "${value}" -> "${final}"`);
                return final;
            }
        } catch (e) {
            return value;
        }
        return value;
    }
});

StyleDictionary.registerTransform({
    name: 'quartz/shadow/css',
    type: 'value',
    transitive: true,
    matcher: (token) => {
        const type = token.$type || token.type;
        return type === 'boxShadow' || type === 'shadow';
    },
    transform: (token) => {
        const value = token.value || token.$value;
        const shadows = Array.isArray(value) ? value : [value];
        const result = shadows.map(shadow => {
            if (typeof shadow !== 'object' || shadow === null) return shadow;
            const { x, y, blur, spread, color, type } = shadow;
            const inset = type === 'innerShadow' ? 'inset ' : '';
            const toPx = (val) => (typeof val === 'number' || (typeof val === 'string' && !isNaN(val) && val.trim() !== '')) ? `${val}px` : val;
            return `${inset}${toPx(x)} ${toPx(y)} ${toPx(blur)} ${toPx(spread)} ${color}`;
        }).join(', ');
        // console.log(`SD_SHADOW: [${token.name}] -> ${result}`);
        return result;
    }
});

StyleDictionary.registerTransform({
    name: 'fontFamily/css/fallback',
    type: 'value',
    matcher: (token) => (token.$type || token.type) === 'fontFamilies',
    transform: (token) => {
        const value = token.value || token.$value;
        if (typeof value !== 'string') return value;
        if (value.includes('Sage UI')) {
            return `"Sage UI", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;
        }
        return value;
    }
});

// Define transform groups
export const groups = {
    css: [
        'quartz/shadow/css',
        'value/math',
        'attribute/cti',
        'name/path/kebab',
        'time/seconds',
        'html/icon',
        'size/rem',
        'color/css',
        'asset/url',
        'fontFamily/css/fallback',
        'cubicBezier/css',
        'strokeStyle/css/shorthand',
        'border/css/shorthand',
        'typography/css/shorthand',
        'transition/css/shorthand'
    ],
    scss: [
        'quartz/shadow/css',
        'value/math',
        'attribute/cti',
        'name/path/kebab',
        'time/seconds',
        'html/icon',
        'size/rem',
        'color/css',
        'asset/url',
        'fontFamily/css/fallback',
        'cubicBezier/css',
        'strokeStyle/css/shorthand',
        'border/css/shorthand',
        'typography/css/shorthand',
        'transition/css/shorthand'
    ],
    js: [
        'attribute/cti',
        'name/path/camel',
        'value/math',
        'size/rem',
        'color/hex'
    ],
    json: [
        'attribute/cti',
        'name/path/kebab'
    ]
};

// Register custom formats
StyleDictionary.registerFormat({
    name: 'custom/json-with-refs',
    format: async ({ dictionary }) => {
        return JSON.stringify(dictionary.tokens, null, 2);
    }
});

StyleDictionary.registerFormat({
    name: 'custom/es6-with-refs',
    format: async ({ dictionary }) => {
        return dictionary.allTokens
            .map(token => `export const ${token.name} = ${JSON.stringify(token.value)};`)
            .join('\n');
    }
});

StyleDictionary.registerFormat({
    name: 'custom/commonjs-exports',
    format: async ({ dictionary }) => {
        return dictionary.allTokens
            .map(token => `module.exports.${token.name} = ${JSON.stringify(token.value)};`)
            .join('\n');
    }
});

StyleDictionary.registerFormat({
    name: 'custom/commonjs-with-refs',
    format: async ({ dictionary }) => {
        return `module.exports = ${JSON.stringify(dictionary.tokens, null, 2)};`;
    }
});

export { StyleDictionary };
