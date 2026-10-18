// Copies browser builds of the libraries into public/vendor. Runs on npm install.
import { build } from 'esbuild';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nm = join(root, 'node_modules');
const out = join(root, 'public', 'vendor');
mkdirSync(out, { recursive: true });

const need = (p) => {
  if (!existsSync(p)) throw new Error(`Missing ${p}. Run "npm install" first.`);
  return p;
};

copyFileSync(need(join(nm, 'pdf-lib', 'dist', 'pdf-lib.min.js')), join(out, 'pdf-lib.min.js'));
copyFileSync(need(join(nm, 'jszip', 'dist', 'jszip.min.js')), join(out, 'jszip.min.js'));
copyFileSync(need(join(nm, 'pdfjs-dist', 'build', 'pdf.worker.mjs')), join(out, 'pdf.worker.min.js'));

// pdf.js as a global script: window.pdfjsLib, same as the CDN build the page expects.
await build({
  stdin: {
    contents: "import './polyfill.mjs';\nimport * as pdfjs from 'pdfjs-dist/build/pdf.mjs';\nwindow.pdfjsLib = pdfjs;\n",
    resolveDir: join(root, 'scripts'),
    loader: 'js',
    sourcefile: 'pdf-global-entry.js',
  },
  bundle: true,
  format: 'iife',
  target: 'es2022',
  minify: true,
  legalComments: 'none',
  outfile: join(out, 'pdf.min.js'),
  logLevel: 'warning',
});
console.log('Vendor files written to public/vendor');
