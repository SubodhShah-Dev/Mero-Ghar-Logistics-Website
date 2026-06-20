import fs from 'fs';
import path from 'path';

const src = 'src';
const dist = 'dist';

// Copy pages, js, styles to dist/src/
const dirs = ['pages', 'js', 'styles'];
for (const dir of dirs) {
  const srcDir = path.join(src, dir);
  const dstDir = path.join(dist, src, dir);
  if (fs.existsSync(srcDir)) {
    copyDir(srcDir, dstDir);
    console.log(`Copied ${srcDir}/ -> ${dstDir}/`);
  }
}

// Copy favicon
const favicon = 'public/favicon.png';
if (fs.existsSync(favicon)) {
  fs.copyFileSync(favicon, path.join(dist, 'favicon.png'));
  console.log(`Copied ${favicon} -> dist/favicon.png`);
}

// Copy compiled CSS from assets/index-*.css -> dist/src/style.css
const assets = fs.readdirSync(path.join(dist, 'assets'));
const builtCss = assets.find(f => f.startsWith('index-') && f.endsWith('.css'));
if (builtCss) {
  const dst = path.join(dist, src, 'style.css');
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(path.join(dist, 'assets', builtCss), dst);
  console.log(`Copied compiled CSS ${builtCss} -> ${dst}`);
}

// Copy src/style.css custom classes too — they're already in the compiled CSS,
// but also copy the raw file for any non-Tailwind styles (though compiled CSS has it all)
// Actually compiled CSS has everything, so we're done.

console.log('Done — pages and compiled styles copied to dist/');

function copyDir(srcDir, dstDir) {
  fs.mkdirSync(dstDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const dstPath = path.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}
