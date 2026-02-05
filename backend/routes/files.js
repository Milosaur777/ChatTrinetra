/**
 * Files API Routes
 * Handle document uploads (PDF, Excel, Word)
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const fileProcessor = require('../services/fileProcessor');

const router = express.Router();

// Configure upload directory
const UPLOAD_DIR = path.join(__dirname, '../../data/captainclaw/uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = uuidv4();
      cb(null, `${name}${ext}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, Excel, Word'));
    }
  }
});

// GET files for a project
router.get('/project/:project_id', async (req, res) => {
  try {
    const { project_id } = req.params;
    const files = await db.all(
      'SELECT * FROM files WHERE project_id = ? ORDER BY created_at DESC',
      [project_id]
    );
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPLOAD file to project
router.post('/upload/:project_id', upload.single('file'), async (req, res) => {
  try {
    const { project_id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Verify project exists
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [project_id]);
    if (!project) {
      fs.unlinkSync(req.file.path); // Delete uploaded file
      return res.status(404).json({ error: 'Project not found' });
    }

    const file_id = uuidv4();
    const file_path = req.file.path;
    const file_type = path.extname(req.file.originalname).toLowerCase();
    const file_size = req.file.size;

    // Extract text based on file type
    let extracted_text = '';
    try {
      extracted_text = await fileProcessor.extractText(file_path, file_type);
    } catch (extractError) {
      console.error('Text extraction error:', extractError);
      extracted_text = '[Text extraction failed - file may be corrupted]';
    }

    // Save file record to database
    await db.run(
      `INSERT INTO files (id, project_id, filename, file_path, file_type, file_size, extracted_text, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        file_id,
        project_id,
        req.file.originalname,
        file_path,
        file_type,
        file_size,
        extracted_text,
        new Date().toISOString()
      ]
    );

    const file = await db.get('SELECT * FROM files WHERE id = ?', [file_id]);
    res.status(201).json(file);
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: error.message });
  }
});

// GET file content
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const file = await db.get('SELECT * FROM files WHERE id = ?', [id]);
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE file
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const file = await db.get('SELECT * FROM files WHERE id = ?', [id]);
    if (!file) return res.status(404).json({ error: 'File not found' });

    // Delete physical file
    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    // Delete database record
    await db.run('DELETE FROM files WHERE id = ?', [id]);
    res.json({ message: 'File deleted', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
