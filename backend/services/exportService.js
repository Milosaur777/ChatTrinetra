/**
 * Export Service
 * Generate PDF and Word documents with formatting
 */

const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

/**
 * Generate PDF from conversation
 */
async function generatePDF({ conversation, messages, project, files }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Title
      doc.fontSize(14).font('Helvetica-Bold').text(conversation.title, { align: 'center' });
      doc.moveDown();

      // Project info
      doc.fontSize(10).font('Helvetica').text(`Project: ${project.name}`, { align: 'left' });
      doc.text(`Created: ${new Date(conversation.created_at).toLocaleDateString()}`, { align: 'left' });
      doc.moveDown();

      // Messages
      messages.forEach((msg, idx) => {
        const isUser = msg.role === 'user';
        doc.fontSize(11).font(isUser ? 'Helvetica-Bold' : 'Helvetica');
        doc.text(`${isUser ? 'You' : 'Assistant'}:`, { underline: true });
        doc.fontSize(11).font('Helvetica').text(msg.content, { align: 'left' });
        doc.moveDown(0.5);
      });

      // Files section if included
      if (files.length > 0) {
        doc.moveDown();
        doc.fontSize(12).font('Helvetica-Bold').text('Referenced Documents');
        doc.moveDown();
        files.forEach(file => {
          doc.fontSize(10).font('Helvetica').text(`- ${file.filename}`);
        });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate Word document from conversation
 */
async function generateDOCX({ conversation, messages, project, files }) {
  const sections = [];

  // Title paragraph
  sections.push(
    new Paragraph({
      text: conversation.title,
      heading: HeadingLevel.HEADING_1,
      bold: true,
      size: 28
    })
  );

  // Metadata
  sections.push(
    new Paragraph({
      text: `Project: ${project.name}`,
      size: 20
    })
  );

  sections.push(
    new Paragraph({
      text: `Created: ${new Date(conversation.created_at).toLocaleDateString()}`,
      size: 20
    })
  );

  sections.push(new Paragraph({ text: '' })); // Spacing

  // Messages
  messages.forEach((msg, idx) => {
    const isUser = msg.role === 'user';
    
    // Speaker label
    sections.push(
      new Paragraph({
        text: isUser ? 'You:' : 'Assistant:',
        bold: true,
        size: 22
      })
    );

    // Message content with project formatting
    sections.push(
      new Paragraph({
        text: msg.content,
        size: project.font_size * 2, // Word uses half-points
        font: project.font_family || 'Times New Roman',
        lineSpacing: project.line_spacing * 240 // Convert to twips
      })
    );

    sections.push(new Paragraph({ text: '' })); // Spacing between messages
  });

  // Files section
  if (files.length > 0) {
    sections.push(new Paragraph({ text: '' }));
    sections.push(
      new Paragraph({
        text: 'Referenced Documents',
        heading: HeadingLevel.HEADING_2,
        bold: true
      })
    );

    files.forEach(file => {
      sections.push(
        new Paragraph({
          text: `• ${file.filename}`,
          size: 20
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        children: sections
      }
    ]
  });

  return Packer.toBuffer(doc);
}

module.exports = {
  generatePDF,
  generateDOCX
};
