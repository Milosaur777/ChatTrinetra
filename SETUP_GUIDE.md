# 🚀 CaptainClaw Setup Guide

Complete setup instructions for both backend and frontend

---

## 📋 Prerequisites

- Node.js 16+ (check: `node --version`)
- npm 8+ (check: `npm --version`)
- Terminal/PowerShell access

---

## 🔧 Backend Setup

### 1. Navigate to backend
```bash
cd /root/clawd/captainclaw-saas/backend
```

### 2. Install dependencies
```bash
npm install
```

This installs:
- Express (web server)
- SQLite3 (database)
- pdf-parse, xlsx, mammoth (file processing)
- axios (HTTP client)
- And more...

**Time:** 2-5 minutes

### 3. Setup environment
```bash
cp .env.example .env
nano .env
```

**Required changes:**
- `OPENROUTER_API_KEY` - Your OpenRouter API key (optional for now)

**Optional:**
- Other API keys if you want to use paid models immediately

Save with `Ctrl+X` then `Y` then `Enter`

### 4. Initialize database
```bash
npm run init-db
```

You'll see:
```
✅ Database connected
✅ Schema created
✅ Sample project created
```

### 5. Start backend
```bash
npm start
```

You should see:
```
🚀 CaptainClaw SaaS Backend running on port 3001
📝 API endpoints:
   GET  /api/projects           - List all projects
   POST /api/projects           - Create new project
   ...
```

✅ **Backend is running!** Leave this terminal open.

---

## 🎨 Frontend Setup

### 1. Open a NEW terminal window/tab

### 2. Navigate to frontend
```bash
cd /root/clawd/captainclaw-saas/frontend
```

### 3. Install dependencies
```bash
npm install
```

**Time:** 2-5 minutes

### 4. Start dev server
```bash
npm run dev
```

You'll see:
```
  VITE v4.4.5  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **Frontend is running!**

---

## 🌐 Access the App

### Open in browser:
```
http://localhost:5173
```

You should see:
- 🏴‍☠️ CaptainClaw logo
- Dark theme (deep charcoal background)
- Project sidebar (left)
- Welcome message (center)

---

## ✅ Test Everything Works

### 1. Create a project
- Click **+ New Project** in sidebar
- Fill in:
  - Name: "Test Project"
  - Description: "Testing CaptainClaw"
  - Everything else is optional
- Click **✨ Create Project**

### 2. Create a conversation
- In the left panel under "Conversations"
- Click the **+** button
- Type a title like "First Chat"
- Press Enter or click **Go**

### 3. Send a message
- Type in the chat input at bottom
- Click **✈️** to send
- Watch for response (might show an error if no API key, that's OK)

### 4. Upload a file (optional)
- In the "Upload Files" section
- Drop a PDF, Excel, or Word file
- Watch it get extracted

---

## 🔑 Setup API Key (Optional But Recommended)

To actually get AI responses:

### Get OpenRouter API Key:
1. Go to https://openrouter.ai/
2. Sign up or login
3. Go to Settings → API Keys
4. Create a new key
5. Copy it

### Add to backend:
```bash
# Terminal in backend folder
nano .env

# Find this line:
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Replace with your actual key, save
```

### Restart backend:
- Stop backend (Ctrl+C)
- Run `npm start` again

Now your AI responses will work!

---

## 🎯 Troubleshooting

### "Cannot connect to backend"
- Make sure backend is running on port 3001
- Check terminal shows "🚀 CaptainClaw SaaS Backend running on port 3001"

### "Module not found" errors
- Delete `node_modules/` folder
- Run `npm install` again

### Port 5173 already in use
- Change in `vite.config.js`: `port: 5174`

### Database errors
- Delete `/root/clawd/data/captainclaw/` folder
- Run `npm run init-db` again

### API requests failing
- Make sure both backend and frontend are running
- Check OpenRouter API key in `.env`

---

## 📁 File Locations

```
/root/clawd/captainclaw-saas/
├── backend/          - Node.js API server (port 3001)
├── frontend/         - React app (port 5173)
└── data/
    └── captainclaw/
        ├── captainclaw.db    - SQLite database
        └── uploads/          - Uploaded files
```

---

## 🚀 Next Steps

1. ✅ Create a few test projects
2. ✅ Upload some files
3. ✅ Chat and test
4. ⏳ Setup OpenRouter key
5. ⏳ Build export functionality
6. ⏳ Deploy to VPS

---

## 💡 Tips

- **Backend restarts:** Changes to code require restart (Ctrl+C, `npm start`)
- **Frontend hot reload:** Changes auto-reload instantly
- **Database reset:** Delete `/root/clawd/data/` to start fresh
- **Multiple files:** Upload multiple PDFs at once by dragging
- **System prompts:** Each project has its own AI personality

---

**Ready to go?** Open browser to `http://localhost:5173` and start building! 🎉

---

Questions? Check the main README.md or PROJECT_PLAN.md
