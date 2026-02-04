/**
 * File Processor Service
 * Extract text from PDF, Excel, and Word documents
 */

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const XLSX = require('xlsx');
const mammoth = require('mammoth');

/**
 * Extract text from file based on type
 */
async function extractText(filePath, fileType) {
  switch (fileType.toLowerCase()) {
    case '.pdf':
      return extractPDF(filePath);
    case '.xlsx':
    case '.xls':
      return extractExcel(filePath);
    case '.docx':
      return extractWord(filePath);
    case '.doc':
      return extractWord(filePath);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

/**
 * Extract text from PDF
 */
async function extractPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract PDF: ${error.message}`);
  }
}

/**
 * Extract text from Excel
 */
function extractExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    let extractedText = '';

    workbook.SheetNames.forEach(sheetName => {
      extractedText += `\n=== Sheet: ${sheetName} ===\n`;
      const worksheet = workbook.Sheets[sheetName];
      const csvData = XLSX.utils.sheet_to_csv(worksheet);
      extractedText += csvData;
    });

    return extractedText;
  } catch (error) {
    console.error('Excel extraction error:', error);
    throw new Error(`Failed to extract Excel: ${error.message}`);
  }
}

/**
 * Extract text from Word document
 */
async function extractWord(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Word extraction error:', error);
    throw new Error(`Failed to extract Word document: ${error.message}`);
  }
}

/**
 * Get file summary (first 500 chars)
 */
function getSummary(text, maxLength = 500) {
  if (!text) return '';
  return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
}

/**
 * Extract metadata about document
 */
function getMetadata(text) {
  return {
    characterCount: text.length,
    wordCount: text.split(/\s+/).length,
    lineCount: text.split('\n').length,
    paragraphCount: text.split('\n\n').length
  };
}

module.exports = {
  extractText,
  extractPDF,
  extractExcel,
  extractWord,
  getSummary,
  getMetadata
};
