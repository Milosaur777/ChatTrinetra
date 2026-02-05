/**
 * CaptainClaw SaaS Backend
 * Main server entry point
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
const projectRoutes = require('./routes/projects');
const conversationRoutes = require('./routes/conversations');
const fileRoutes = require('./routes/files');
const chatRoutes = require('./routes/chat');
const exportRoutes = require('./routes/export');

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CaptainClaw SaaS Backend', version: '0.1.0' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Initialize database and start server
const dbModule = require('./db');

async function startServer() {
  try {
    console.log('🔧 Initializing database...');
    await dbModule.initDB();
    await dbModule.initSchema();
    console.log('✅ Database ready');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 CaptainClaw SaaS Backend running on port ${PORT} (all interfaces)`);
      console.log(`📝 API endpoints:`);
      console.log(`   GET  /api/projects           - List all projects`);
      console.log(`   POST /api/projects           - Create new project`);
      console.log(`   GET  /api/conversations/:id  - Get project conversations`);
      console.log(`   POST /api/chat               - Send message in conversation`);
      console.log(`   POST /api/files/:project_id  - Upload file to project`);
      console.log(`   POST /api/export/:conv_id    - Export conversation`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
