// src/convert-logo.js
const fs = require('fs');
const path = require('path');

const imagePath = path.join(__dirname, 'assets', 'logo_nsc.jpg'); // Adjusted to match your structure
const outputPath = path.join(__dirname, 'logo-base64.txt');

try {
  const base64 = fs.readFileSync(imagePath, { encoding: 'base64' });
  const dataUrl = `data:image/jpeg;base64,${base64}`;
  fs.writeFileSync(outputPath, dataUrl);
} catch (err) {
  console.error('❌ Failed to convert logo:', err.message);
}