const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\acer\\.gemini\\antigravity\\brain\\8f7ac284-4f3e-4849-a8f6-be214d1a3a91';
const destDir = 'C:\\Users\\acer\\OneDrive\\Desktop\\portfolio';

const files = [
  { src: 'home_avatar_1782916461970.png', dest: 'home_avatar.png' },
  { src: 'about_illustration_1782916476883.png', dest: 'about_illustration.png' }
];

files.forEach(f => {
  const srcPath = path.join(srcDir, f.src);
  const destPath = path.join(destDir, f.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${f.src} to ${f.dest}`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
});
