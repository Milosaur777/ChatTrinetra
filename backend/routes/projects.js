/**
 * Projects API Routes
 * CRUD operations for projects
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await db.all('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new project
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      system_prompt,
      tone,
      language,
      font_family,
      font_size,
      line_spacing,
      heading_font_size,
      heading_bold
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Project name is required' });

    const id = uuidv4();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO projects (
        id, name, description, system_prompt, tone, language,
        font_family, font_size, line_spacing, heading_font_size, heading_bold,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        description || null,
        system_prompt || '',
        tone || 'neutral',
        language || 'Swedish',
        font_family || 'Times New Roman',
        font_size || 12,
        line_spacing || 1.5,
        heading_font_size || 14,
        heading_bold !== false ? 1 : 0,
        now,
        now
      ]
    );

    const project = await db.get('SELECT * FROM projects WHERE id = ?', [id]);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const now = new Date().toISOString();

    const allowedFields = [
      'name', 'description', 'system_prompt', 'tone', 'language',
      'font_family', 'font_size', 'line_spacing', 'heading_font_size', 'heading_bold'
    ];

    const setClause = allowedFields
      .filter(field => updates.hasOwnProperty(field))
      .map(field => `${field} = ?`)
      .join(', ');

    if (!setClause) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const values = allowedFields
      .filter(field => updates.hasOwnProperty(field))
      .map(field => updates[field]);

    values.push(now);
    values.push(id);

    await db.run(
      `UPDATE projects SET ${setClause}, updated_at = ? WHERE id = ?`,
      values
    );

    const project = await db.get('SELECT * FROM projects WHERE id = ?', [id]);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [id]);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    await db.run('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
