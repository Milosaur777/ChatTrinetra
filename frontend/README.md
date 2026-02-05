# 🏴‍☠️ CaptainClaw Frontend

Beautiful React + Tailwind + Framer Motion UI for CaptainClaw SaaS

---

## 🎨 Design System

**Colors:**
- `cc-dark`: #0F1419 (Main background)
- `cc-darker`: #0A0D12 (Sidebar)
- `cc-card`: #1A1F2E (Card background)
- `cc-mint`: #A8E6CF (Primary action)
- `cc-pink`: #FFB6D9 (Secondary accent)
- `cc-blue`: #A8D8EA (Tertiary accent)
- `cc-orange`: #FFD4A8 (Quaternary accent)

**Effects:**
- Glassmorphism (frosted glass)
- Framer Motion transitions
- Smooth animations
- Responsive Bento grid

---

## 📁 Structure

```
src/
├── App.jsx                 - Main app component
├── components/
│   ├── Sidebar.jsx        - Projects sidebar
│   ├── MainContent.jsx    - Main layout
│   ├── ProjectDashboard.jsx - Dashboard with bento grid
│   ├── ChatWindow.jsx     - Chat interface
│   ├── CreateProjectModal.jsx - Project creation
│   └── FileUpload.jsx     - File upload
├── services/
│   └── api.js             - API client
└── index.css              - Tailwind styles
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Server runs on `http://localhost:5173`

---

## 🔗 API Integration

Frontend communicates with backend at `http://localhost:3001/api`

**Proxied endpoints:**
- GET `/api/projects`
- POST `/api/projects`
- GET/POST/DELETE `/api/conversations`
- GET/POST/DELETE `/api/files`
- POST `/api/chat/send`

---

## 💻 Components

### Sidebar
- Project list (bento cards)
- New project button
- Delete with hover effect

### MainContent
- Top navigation
- Content routing
- Settings access

### ProjectDashboard
- Stats bento grid
- Conversations list
- File upload
- Chat window

### ChatWindow
- Message history
- Real-time chat
- Loading states
- Timestamp display

### FileUpload
- Drag & drop
- Multiple file support
- Progress indication
- Supported: PDF, Excel, Word

---

## 🎬 Usage

1. Create a project (set tone, language, formatting)
2. Create a conversation within the project
3. Upload documents (PDF/Excel/Word)
4. Chat with AI using file context
5. Export conversation to PDF/Word

---

## 📦 Dependencies

- `react` - UI library
- `react-dom` - React DOM
- `framer-motion` - Animations
- `axios` - HTTP client
- `tailwindcss` - Styling
- `vite` - Build tool

---

## 🎯 Next Steps

- [ ] Export functionality
- [ ] Image upload & analysis
- [ ] Real-time collaboration
- [ ] User authentication
- [ ] Dark mode (default) / Light mode toggle
- [ ] Mobile optimization

---

Built with 💙 by CaptainClaw
