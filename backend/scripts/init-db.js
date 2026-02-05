#!/usr/bin/env node

/**
 * Initialize CaptainClaw database
 * Run once on first setup
 */

const db = require('../db');

async function main() {
  try {
    console.log('🔧 Initializing CaptainClaw database...');
    
    // Initialize database connection
    await db.initDB();
    console.log('✅ Database connected');
    
    // Initialize schema
    await db.initSchema();
    console.log('✅ Schema created');
    
    // Create sample project for testing
    const sampleProjectId = require('uuid').v4();
    await db.run(
      `INSERT INTO projects (id, name, description, system_prompt, tone, language, font_family, font_size, line_spacing, heading_font_size, heading_bold, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sampleProjectId,
        'Sample Project',
        'Test project to get started',
        'You are a helpful AI assistant. Respond in a friendly and clear manner.',
        'friendly',
        'Swedish',
        'Times New Roman',
        12,
        1.5,
        14,
        1,
        new Date().toISOString(),
        new Date().toISOString()
      ]
    );
    console.log('✅ Sample project created');
    
    console.log('');
    console.log('🎉 Database initialized successfully!');
    console.log('');
    console.log('Sample project ID:', sampleProjectId);
    console.log('');
    console.log('Next steps:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Add your OpenRouter API key to .env');
    console.log('3. Run: npm start');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();
