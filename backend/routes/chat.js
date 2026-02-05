/**
 * Chat API Routes
 * Send messages with file context using LLM
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const llmService = require('../services/llmService');

const router = express.Router();

// POST send message
router.post('/send', async (req, res) => {
  try {
    const {
      conversation_id,
      project_id,
      message,
      referenced_file_ids,
      model
    } = req.body;

    if (!conversation_id || !project_id || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get project for system prompt
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [project_id]);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Get conversation
    const conversation = await db.get(
      'SELECT * FROM conversations WHERE id = ? AND project_id = ?',
      [conversation_id, project_id]
    );
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    // Get file context if referenced
    let fileContext = '';
    if (referenced_file_ids && referenced_file_ids.length > 0) {
      const files = await db.all(
        `SELECT * FROM files WHERE id IN (${referenced_file_ids.map(() => '?').join(',')})`,
        referenced_file_ids
      );
      fileContext = files
        .map(f => `\n[File: ${f.filename}]\n${f.extracted_text}`)
        .join('\n---\n');
    }

    // Get message history for context
    const messageHistory = await db.all(
      'SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT 10',
      [conversation_id]
    );

    // Call LLM service
    const response = await llmService.chat({
      system_prompt: project.system_prompt,
      message,
      file_context: fileContext,
      message_history: messageHistory,
      model: model || 'openrouter/anthropic/claude-haiku-4.5'
    });

    // Save user message
    const user_message_id = uuidv4();
    await db.run(
      `INSERT INTO messages (id, conversation_id, role, content, referenced_files, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user_message_id,
        conversation_id,
        'user',
        message,
        referenced_file_ids ? JSON.stringify(referenced_file_ids) : null,
        new Date().toISOString()
      ]
    );

    // Save assistant response
    const assistant_message_id = uuidv4();
    await db.run(
      `INSERT INTO messages (id, conversation_id, role, content, model_used, tokens_used, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        assistant_message_id,
        conversation_id,
        'assistant',
        response.content,
        response.model,
        response.tokens,
        new Date().toISOString()
      ]
    );

    // Update conversation timestamp
    await db.run(
      'UPDATE conversations SET updated_at = ? WHERE id = ?',
      [new Date().toISOString(), conversation_id]
    );

    res.json({
      user_message_id,
      assistant_message_id,
      response: response.content,
      model: response.model,
      tokens_used: response.tokens
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET message history
router.get('/history/:conversation_id', async (req, res) => {
  try {
    const { conversation_id } = req.params;
    const messages = await db.all(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversation_id]
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
