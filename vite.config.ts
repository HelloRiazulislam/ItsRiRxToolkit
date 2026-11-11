import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { transform as lightningTransform } from 'lightningcss';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

/**
 * Unwraps all CSS `@layer` blocks and strips standalone `@layer` statements
 * so browsers on freshly installed Windows ISOs (e.g. Chromium/Edge 79-98, Firefox < 97)
 * never ignore the stylesheet rules.
 */
function unwrapCssLayers(css: string): string {
  let out = css.replace(/@layer\s+[a-zA-Z0-9_.,\s-]+;/g, '');
  while (true) {
    const match = out.match(/@layer\s+[a-zA-Z0-9_.-]*\s*\{/);
    if (!match || match.index === undefined) break;
    const startIdx = match.index;
    const openBraceIdx = startIdx + match[0].length - 1;
    let depth = 1;
    let i = openBraceIdx + 1;
    let inString = false;
    let stringChar = '';
    while (i < out.length && depth > 0) {
      const ch = out[i];
      const prev = i > 0 ? out[i - 1] : '';
      if (inString) {
        if (ch === stringChar && prev !== '\\') inString = false;
      } else {
        if (ch === '"' || ch === "'") {
          inString = true;
          stringChar = ch;
        } else if (ch === '{') {
          depth++;
        } else if (ch === '}') {
          depth--;
        }
      }
      i++;
    }
    if (depth === 0) {
      const inner = out.slice(openBraceIdx + 1, i - 1);
      out = out.slice(0, startIdx) + inner + out.slice(i);
    } else {
      break;
    }
  }
  return out;
}

/**
 * Removes `@supports (color: color-mix(...))` blocks after LightningCSS has already
 * emitted standard #hex / rgba() declarations, ensuring 100% deterministic colors across all browsers.
 */
function removeColorMixSupportsBlocks(css: string): string {
  let out = css;
  while (true) {
    const match = out.match(/@supports\s*\(\s*color:\s*color-mix\([^{]+\{/);
    if (!match || match.index === undefined) break;
    const startIdx = match.index;
    const openBraceIdx = startIdx + match[0].length - 1;
    let depth = 1;
    let i = openBraceIdx + 1;
    let inString = false;
    let stringChar = '';
    while (i < out.length && depth > 0) {
      const ch = out[i];
      const prev = i > 0 ? out[i - 1] : '';
      if (inString) {
        if (ch === stringChar && prev !== '\\') inString = false;
      } else {
        if (ch === '"' || ch === "'") {
          inString = true;
          stringChar = ch;
        } else if (ch === '{') {
          depth++;
        } else if (ch === '}') {
          depth--;
        }
      }
      i++;
    }
    if (depth === 0) {
      out = out.slice(0, startIdx) + out.slice(i);
    } else {
      break;
    }
  }
  return out;
}

/**
 * Converts modern Tailwind v4 CSS (@layer, oklch, color-mix, nesting) into universal CSS3
 * compatible with all browsers (including un-updated Edge/Chrome/Firefox on fresh Windows installs).
 */
function compileUniversalCss(rawCss: string, filename = 'index.css'): string {
  try {
    const unwrapped = unwrapCssLayers(rawCss);
    const transformed = lightningTransform({
      filename,
      code: Buffer.from(unwrapped),
      targets: {
        chrome: 79 << 16,
        edge: 79 << 16,
        firefox: 78 << 16,
        safari: 13 << 16,
      },
      errorRecovery: true,
    });
    const lowered = Buffer.from(transformed.code).toString('utf-8');
    return removeColorMixSupportsBlocks(lowered);
  } catch {
    return unwrapCssLayers(rawCss);
  }
}

function universalBrowserCssPlugin(): Plugin {
  return {
    name: 'universal-browser-css-compat',
    enforce: 'post',
    transform(code, id) {
      if (!id.includes('.css')) return null;
      // Handle Vite dev mode where CSS is wrapped in __vite__css = "..."
      const viteCssMatch = code.match(/const __vite__css = ("(?:[^"\\]|\\.)*")/);
      if (viteCssMatch) {
        try {
          const originalCss = JSON.parse(viteCssMatch[1]) as string;
          const compatCss = compileUniversalCss(originalCss, id);
          return code.replace(viteCssMatch[0], `const __vite__css = ${JSON.stringify(compatCss)}`);
        } catch {
          return null;
        }
      }
      // Handle standard raw CSS transform
      if (!code.includes('const __vite__css')) {
        return compileUniversalCss(code, id);
      }
      return null;
    },
    generateBundle(_options, bundle) {
      for (const [fileName, chunkOrAsset] of Object.entries(bundle)) {
        if (fileName.endsWith('.css') && chunkOrAsset.type === 'asset' && typeof chunkOrAsset.source === 'string') {
          chunkOrAsset.source = compileUniversalCss(chunkOrAsset.source, fileName);
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), universalBrowserCssPlugin()],
    build: {
      target: ['es2019', 'edge79', 'firefox78', 'chrome79', 'safari13'],
      cssTarget: ['edge79', 'firefox78', 'chrome79', 'safari13'],
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
