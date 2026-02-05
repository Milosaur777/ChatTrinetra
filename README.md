# 🏴‍☠️ CaptainClaw SaaS

**ChatGPT Alternative with Projects, Files, and Image Processing**

Build your own productivity AI system without ChatGPT subscriptions!

---

## ✨ Features

### 📁 Project Management
- Create projects as document containers
- Custom system prompts per project
- Text formatting rules (font, size, style)
- Project-specific AI personalities

### 📄 Document Handling
- Upload PDF, Excel, Word documents
- Automatic text extraction
- File context in conversations
- Batch processing support

### 💬 Multi-Conversation Interface
- Multiple chats per project
- Named conversation threads
- Message history persistence
- Cross-conversation search

### 🤖 Smart AI Integration
- Model routing (Haiku → Kimi → Sonnet)
- Ollama support (free local inference)
- OpenRouter integration (cheap API access)
- Token-efficient context management

### 📊 Export & Generation
- Export to PDF with formatting
- Generate Word documents
- Project-specific formatting rules
- Template-based document creation

### 🎨 Image Processing
- Vision model integration
- Image uploads and analysis
- OCR text extraction
- Batch processing

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Ollama (optional, for free local inference)
- OpenRouter API key (for cheap remote models)

### Installation

```bash
# Clone and setup
cd /root/clawd/captainclaw-saas/backend
npm install

# Create .env from template
cp .env.example .env

# Add your API keys to .env
nano .env

# Initialize database
npm run init-db

# Start server
npm start
```

Server runs on `http://localhost:3001`

---

## 📚 API Endpoints

### Projects
```
GET    /api/projects              - List all projects
POST   /api/projects              - Create new project
GET    /api/projects/:id          - Get single project
PUT    /api/projects/:id          - Update project
DELETE /api/projects/:id          - Delete project
```

### Conversations
```
GET    /api/conversations/project/:project_id  - List conversations
GET    /api/conversations/:id                  - Get conversation with messages
POST   /api/conversations                      - Create new conversation
PUT    /api/conversations/:id                  - Update conversation
DELETE /api/conversations/:id                  - Delete conversation
```

### Files
```
GET    /api/files/project/:project_id  - List project files
POST   /api/files/upload/:project_id   - Upload file to project
GET    /api/files/:id                  - Get file info
DELETE /api/files/:id                  - Delete file
```

### Chat
```
POST   /api/chat/send              - Send message with file context
GET    /api/chat/history/:conv_id  - Get conversation history
```

### Export
```
POST   /api/export/pdf/:conv_id   - Export conversation to PDF
POST   /api/export/docx/:conv_id  - Export conversation to Word
```

---

## 🎯 Usage Example

### 1. Create Project
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novel Writing",
    "description": "Working on my sci-fi novel",
    "system_prompt": "You are a creative writing assistant. Help with character development, plot structure, and dialogue.",
    "tone": "creative",
    "language": "Swedish"
  }'
```

### 2. Upload Document
```bash
curl -X POST http://localhost:3001/api/files/upload/{project_id} \
  -F "file=@manuscript.pdf"
```

### 3. Create Conversation
```bash
curl -X POST http://localhost:3001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "{project_id}",
    "title": "Character Development",
    "description": "Developing main character backstory"
  }'
```

### 4. Send Message
```bash
curl -X POST http://localhost:3001/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "{conv_id}",
    "project_id": "{project_id}",
    "message": "Help me develop the main character",
    "referenced_file_ids": ["{file_id}"],
    "model": "openrouter/moonshotai/kimi-k2.5"
  }'
```

### 5. Export to PDF
```bash
curl -X POST http://localhost:3001/api/export/pdf/{conv_id} \
  -H "Content-Type: application/json" \
  -d '{"include_files": true}' \
  > conversation.pdf
```

---

## 💰 Cost Comparison

| Task | ChatGPT Pro | CaptainClaw |
|------|------------|-------------|
| 100 PDFs/month | $20 | $0.50 |
| Chat + projects | $20 | $0 (Ollama) |
| File generation | Extra | $0.10 |
| **Monthly** | **$20** | **$0.60** |
| **Annual** | **$240** | **$7.20** |

---

## 🏗️ Tech Stack

- **Backend:** Node.js + Express
- **Database:** SQLite (simple, portable)
- **File Processing:** pdf-parse, xlsx, mammoth
- **LLM Integration:** OpenRouter API
- **Local Inference:** Ollama
- **Document Export:** PDFKit, docx
- **Hosting:** VPS ready

---

## 📋 Roadmap

- [x] Project management
- [x] File upload and extraction
- [x] Multi-conversation interface
- [x] Chat with file context
- [x] PDF/Word export
- [ ] Image processing & vision
- [ ] User authentication (multi-user)
- [ ] Shared projects & collaboration
- [ ] API for n8n automations
- [ ] Web frontend (React/Vue)
- [ ] Mobile app
- [ ] SaaS marketplace

---

## 🔧 Development

```bash
# Watch mode
npm run dev

# Run tests
npm test

# Initialize fresh database
npm run init-db
```

---

## 📄 License

MIT - Use freely, modify as needed

---

**Built by CaptainClaw 🏴‍☠️ for Milo**

Questions? Issues? [GitHub Issues](https://github.com/Milosaur777/CaptainClaw)
