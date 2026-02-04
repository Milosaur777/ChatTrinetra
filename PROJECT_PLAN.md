# 🏴‍☠️ CaptainClaw SaaS - Project Plan

**Date Started:** 2026-02-04  
**Status:** MVP Backend Complete ✅  
**Target:** Sellable SaaS in 6 weeks

---

## 🎯 Phase Overview

### Phase 1: MVP Backend (NOW) ✅
**Timeline:** 1-2 weeks  
**Goal:** Functional backend for projects, files, conversations

**Completed:**
- ✅ Database schema (projects, files, conversations, messages)
- ✅ Project management API
- ✅ Conversation management
- ✅ File upload & text extraction (PDF, Excel, Word)
- ✅ Chat API with file context
- ✅ Export to PDF/Word
- ✅ LLM integration (OpenRouter + Ollama)
- ✅ Model routing (Haiku → Kimi → Sonnet)

**TODO:**
- [ ] Frontend UI (React/Vue or HTML)
- [ ] Test all endpoints
- [ ] Image processing integration
- [ ] User authentication (basic)

---

### Phase 2: Frontend & Polish (Weeks 2-3)
**Goal:** Beautiful, usable interface

**Tasks:**
- [ ] Web UI scaffolding
- [ ] Projects list & creation
- [ ] File upload interface
- [ ] Chat window with file sidebar
- [ ] Conversation management UI
- [ ] Settings/formatting panel
- [ ] Export buttons
- [ ] Responsive design

**Tech:** React or Vue (or simple HTML/CSS/JS)

---

### Phase 3: Image Processing & Advanced (Week 4)
**Goal:** Vision models, advanced features

**Tasks:**
- [ ] Image upload handler
- [ ] Vision model integration (Gemini/Claude)
- [ ] OCR text extraction
- [ ] Image analysis & categorization
- [ ] Batch processing
- [ ] Advanced formatting templates

---

### Phase 4: Scaling & n8n (Week 5)
**Goal:** Multi-user, automations

**Tasks:**
- [ ] User authentication (JWT)
- [ ] Multi-user support
- [ ] Shared workspaces
- [ ] n8n webhook integration
- [ ] API documentation
- [ ] Rate limiting

---

### Phase 5: SaaS & Deployment (Week 6)
**Goal:** Production-ready, hosted

**Tasks:**
- [ ] Hosting setup (VPS)
- [ ] SSL/TLS
- [ ] Backup & recovery
- [ ] Monitoring
- [ ] Documentation
- [ ] Pricing tiers
- [ ] Payment integration (Stripe)

---

## 💻 Current Architecture

```
CaptainClaw Backend
├── Routes
│   ├── /api/projects      - Project CRUD
│   ├── /api/conversations - Conversation management
│   ├── /api/files         - File upload/extract
│   ├── /api/chat          - Send messages
│   └── /api/export        - PDF/Word generation
├── Services
│   ├── fileProcessor      - Extract text from documents
│   ├── llmService         - LLM integration
│   └── exportService      - PDF/Word generation
└── Database (SQLite)
    ├── projects           - Project definitions
    ├── files              - Uploaded documents
    ├── conversations      - Chat threads
    └── messages           - Chat history
```

---

## 📊 Database Schema

**Projects Table:**
- id, name, description, system_prompt
- tone, language (formatting)
- font_family, font_size, line_spacing
- heading_font_size, heading_bold
- created_at, updated_at

**Files Table:**
- id, project_id, filename, file_path
- file_type, file_size, extracted_text
- created_at

**Conversations Table:**
- id, project_id, title, description
- created_at, updated_at

**Messages Table:**
- id, conversation_id, role (user/assistant)
- content, model_used, tokens_used
- referenced_files, created_at

---

## 🚀 Deployment Checklist

- [ ] Backend tested locally
- [ ] Frontend built & tested
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] API documentation complete
- [ ] Security review (SQL injection, auth, etc)
- [ ] Performance testing
- [ ] Load testing
- [ ] Backup strategy
- [ ] Monitoring setup

---

## 💰 Revenue Model (Future)

**Pricing Tiers:**
- **Free:** 3 projects, basic export, 5MB upload limit
- **Pro:** $9/mo - Unlimited projects, advanced formatting, 100MB upload
- **Team:** $29/mo - Multi-user, shared workspaces, API access
- **Enterprise:** Custom - White-label, dedicated support

**First Users:**
1. Milo (free, founder)
2. Friends (free trial → Pro)
3. Early adopters (launch discount)
4. SaaS directory listing

**Target:** 50-100 Pro users = $450-900/month

---

## 🎯 Success Metrics

- MVP frontend live: Feb 12
- Image processing working: Feb 18
- n8n integration: Feb 25
- First 10 beta users: Mar 4
- Launch: Mar 11
- 50 Pro users: May 1

---

## 📝 Notes

**Tech Decisions:**
- SQLite for MVP (simple, portable, no separate DB service)
- OpenRouter + Ollama (flexibility, cost optimization)
- Node.js (fast iteration, familiar to team)
- PDF/Word via libraries (no extra services)

**Future Improvements:**
- PostgreSQL migration (if scaling beyond 10k users)
- Redis for caching
- Message queue (for async file processing)
- CDN for file delivery
- WebSocket for real-time collab

---

**Built by:** CaptainClaw 🏴‍☠️  
**For:** Milo  
**Status:** In Active Development 🚀
