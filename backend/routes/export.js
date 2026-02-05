/**
 * Export API Routes
 * Generate PDF and Word documents from conversations
 */

const express = require('express');
const db = require('../db');
const exportService = require('../services/exportService');

const router = express.Router();

// EXPORT conversation to PDF
router.post('/pdf/:conversation_id', async (req, res) => {
  try {
    const { conversation_id } = req.params;
    const { include_files } = req.body;

    // Get conversation with messages
    const conversation = await db.get(
      'SELECT * FROM conversations WHERE id = ?',
      [conversation_id]
    );
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    const messages = await db.all(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversation_id]
    );

    // Get project for formatting
    const project = await db.get(
      'SELECT * FROM projects WHERE id = ?',
      [conversation.project_id]
    );

    // Get files if requested
    let files = [];
    if (include_files) {
      files = await db.all(
        'SELECT * FROM files WHERE project_id = ?',
        [conversation.project_id]
      );
    }

    // Generate PDF
    const pdfBuffer = await exportService.generatePDF({
      conversation,
      messages,
      project,
      files: include_files ? files : []
    });

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${conversation.title}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// EXPORT conversation to Word
router.post('/docx/:conversation_id', async (req, res) => {
  try {
    const { conversation_id } = req.params;
    const { include_files } = req.body;

    // Get conversation with messages
    const conversation = await db.get(
      'SELECT * FROM conversations WHERE id = ?',
      [conversation_id]
    );
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    const messages = await db.all(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversation_id]
    );

    // Get project for formatting
    const project = await db.get(
      'SELECT * FROM projects WHERE id = ?',
      [conversation.project_id]
    );

    // Get files if requested
    let files = [];
    if (include_files) {
      files = await db.all(
        'SELECT * FROM files WHERE project_id = ?',
        [conversation.project_id]
      );
    }

    // Generate Word document
    const docxBuffer = await exportService.generateDOCX({
      conversation,
      messages,
      project,
      files: include_files ? files : []
    });

    // Send Word document
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${conversation.title}.docx"`);
    res.send(docxBuffer);
  } catch (error) {
    console.error('DOCX export error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
