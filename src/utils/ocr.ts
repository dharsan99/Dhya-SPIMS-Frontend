import Tesseract from 'tesseract.js';

export const extractTextWithTesseract = async (image: string): Promise<string> => {
  const result = await Tesseract.recognize(image, 'eng', {
    logger: () => {}
  });
  return result.data.text;
};