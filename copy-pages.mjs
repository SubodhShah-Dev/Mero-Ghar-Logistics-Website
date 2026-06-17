import fs from 'fs';
import path from 'path';

const src = 'src';
const dist = 'dist';

const dirs = ['pages', 'js', 'styles'];
for (const dir of dirs) {
  const srcDir = path.join(src, dir);
  const dstDir = path.join(dist, src, dir);
  if (fs.existsSync(srcDir)) {
    copyDir(srcDir, dstDir);
    console.log(`Copied ${srcDir}/ -> ${dstDir}/`);
  }
}

// Also copy style.css to dist/src/
const styleSrc = path.join(src, 'style.css');
const styleDst = path.join(dist, src, 'style.css');
if (fs.existsSync(styleSrc)) {
  fs.mkdirSync(path.dirname(styleDst), { recursive: true });
  fs.copyFileSync(styleSrc, styleDst);
  console.log(`Copied ${styleSrc} -> ${styleDst}`);
}

console.log('All pages and assets copied to dist/');

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
