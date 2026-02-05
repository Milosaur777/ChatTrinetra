/**
 * File Processor Service
 * Extract text from PDF, Excel, and Word documents
 */

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const ExcelJS = require('exceljs');
const mammoth = require('mammoth');

/**
 * Extract text from file based on type
 */
async function extractText(filePath, fileType) {
  switch (fileType.toLowerCase()) {
    case '.pdf':
      return await extractPDF(filePath);
    case '.xlsx':
    case '.xls':
      return await extractExcel(filePath);
    case '.docx':
      return await extractWord(filePath);
    case '.doc':
      return await extractWord(filePath);
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
async function extractExcel(filePath) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    let extractedText = '';

    workbook.eachSheet((worksheet, sheetId) => {
      extractedText += `\n=== Sheet: ${worksheet.name} ===\n`;
      worksheet.eachRow((row) => {
        const rowData = row.values.map(cell => cell ? cell.toString() : '').join('\t');
        extractedText += rowData + '\n';
      });
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
