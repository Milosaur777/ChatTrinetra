/**
 * Conversations API Routes
 * Manage multiple conversations per project
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();

// GET conversations for a project
router.get('/project/:project_id', async (req, res) => {
  try {
    const { project_id } = req.params;
    const conversations = await db.all(
      'SELECT * FROM conversations WHERE project_id = ? ORDER BY updated_at DESC',
      [project_id]
    );
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single conversation with messages
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await db.get(
      'SELECT * FROM conversations WHERE id = ?',
      [id]
    );
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    const messages = await db.all(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [id]
    );

    res.json({ ...conversation, messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new conversation
router.post('/', async (req, res) => {
  try {
    const { project_id, title, description } = req.body;

    if (!project_id || !title) {
      return res.status(400).json({ error: 'Project ID and title are required' });
    }

    // Verify project exists
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [project_id]);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const id = uuidv4();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO conversations (id, project_id, title, description, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, project_id, title, description || null, now, now]
    );

    const conversation = await db.get('SELECT * FROM conversations WHERE id = ?', [id]);
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE conversation (PUT - full update)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const now = new Date().toISOString();

    // Verify conversation exists
    const conversation = await db.get('SELECT * FROM conversations WHERE id = ?', [id]);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Validate title if provided
    if (title && !title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    await db.run(
      'UPDATE conversations SET title = ?, description = ?, updated_at = ? WHERE id = ?',
      [title || null, description || null, now, id]
    );

    const updatedConversation = await db.get('SELECT * FROM conversations WHERE id = ?', [id]);
    res.json({ success: true, conversation: updatedConversation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE conversation (PATCH - partial update)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const now = new Date().toISOString();

    // Verify conversation exists
    const conversation = await db.get('SELECT * FROM conversations WHERE id = ?', [id]);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Validate title if provided
    if (title !== undefined && title !== null && !String(title).trim()) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    // Build update query based on what was provided
    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }

    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = ?');
    params.push(now);
    params.push(id);

    await db.run(
      `UPDATE conversations SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const updatedConversation = await db.get('SELECT * FROM conversations WHERE id = ?', [id]);
    res.json({ success: true, conversation: updatedConversation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE conversation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM conversations WHERE id = ?', [id]);
    res.json({ message: 'Conversation deleted', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
