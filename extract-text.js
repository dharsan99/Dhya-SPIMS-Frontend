// extract-text.js
const { execSync } = require('child_process');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'output_images');

async function extractFromImage(imagePath) {
  const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
  return text.trim();
}

async function extractFromPDF(pdfPath) {
  console.log(`📂 Converting PDF to PNG using Poppler...`);

  if (fs.existsSync(outputDir)) fs.rmSync(outputDir, { recursive: true });
  fs.mkdirSync(outputDir);

  try {
    execSync(`pdftoppm -png -r 300 "${pdfPath}" "${outputDir}/page"`);
  } catch (err) {
    console.error('❌ Failed to convert PDF using pdftoppm:', err);
    return '';
  }

  const imageFiles = fs.readdirSync(outputDir)
    .filter(f => f.endsWith('.png'))
    .sort();

  let fullText = '';
  for (const file of imageFiles) {
    const filePath = path.join(outputDir, file);
    console.log(`🧠 OCR on ${file}...`);
    const text = await extractFromImage(filePath);
    fullText += `\n\n--- ${file} ---\n${text}`;
  }

  return fullText.trim();
}

(async () => {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('❌ Please provide a file path as argument (PDF or image).');
    process.exit(1);
  }

  const ext = path.extname(filePath).toLowerCase();
  let text = '';

  console.log(`📂 Processing file: ${filePath}`);

  if (ext === '.pdf') {
    text = await extractFromPDF(filePath);
  } else if (['.jpg', '.jpeg', '.png', '.bmp', '.tiff'].includes(ext)) {
    text = await extractFromImage(filePath);
  } else {
    console.error('❌ Unsupported file type. Please provide PDF or image formats.');
    process.exit(1);
  }

  console.log('\n📄 Extracted Text:\n');
  console.log(text || '[No text found]');
})();