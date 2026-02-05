# 🚀 ChatTrinetra Deployment Guide

**Last Updated:** 2026-02-05  
**Environment:** Production (31.97.38.247)

---

## 📊 Architecture

```
Internet (Browser)
    ↓
NGINX (Port 80)
    ├─ Static files: /frontend/dist/
    └─ /api/* → Backend (Port 3001)
         ↓
Node.js Backend (systemd service)
    ├─ Express API
    ├─ SQLite Database
    └─ LLM Integration (Haiku)
```

---

## 🔧 Backend Service Management

### Start Backend
```bash
systemctl start captainclaw-backend
```

### Check Status
```bash
systemctl status captainclaw-backend
```

### View Logs (Real-time)
```bash
journalctl -u captainclaw-backend -f
```

### View Recent Logs (Last 50 lines)
```bash
journalctl -u captainclaw-backend -n 50
```

### Restart Backend
```bash
systemctl restart captainclaw-backend
```

### Stop Backend (if needed)
```bash
systemctl stop captainclaw-backend
```

---

## 🔨 Frontend Deployment

### Rebuild Frontend
When code changes are made:
```bash
cd /root/clawd/captainclaw-saas/frontend
npm install  # if new dependencies added
npm run build
```

The built files go to `/frontend/dist/` which NGINX serves automatically.

### Rebuild & Deploy
```bash
cd /root/clawd/captainclaw-saas/frontend && npm run build
```

Then hard refresh browser (Ctrl+Shift+R) to see changes.

---

## 📁 Key Paths

| Component | Path |
|-----------|------|
| Frontend Source | `/root/clawd/captainclaw-saas/frontend/src/` |
| Frontend Build | `/root/clawd/captainclaw-saas/frontend/dist/` |
| Backend | `/root/clawd/captainclaw-saas/backend/` |
| Database | `/root/clawd/data/captainclaw/captainclaw.db` |
| NGINX Config | `/etc/nginx/sites-available/default` |
| Backend Service | `/etc/systemd/system/captainclaw-backend.service` |

---

## 🔗 API Endpoints

All endpoints are proxied through NGINX at `http://31.97.38.247/api/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create new project |
| GET | `/api/conversations/:id` | Get project conversations |
| POST | `/api/chat` | Send message in conversation |
| POST | `/api/files/:project_id` | Upload file to project |
| POST | `/api/export/:conv_id` | Export conversation |
| GET | `/health` | Backend health check |

---

## 🚨 Troubleshooting

### Backend Says "Port 3001 already in use"

**Solution:**
```bash
# Check if port is in use
lsof -i :3001

# If something else is using it:
kill -9 <PID>

# Then restart service:
systemctl restart captainclaw-backend
```

### "Backend Unavailable" in Browser

**Check:**
1. Backend service is running
   ```bash
   systemctl status captainclaw-backend
   ```

2. Database is accessible
   ```bash
   ls -la /root/clawd/data/captainclaw/captainclaw.db
   ```

3. NGINX is configured correctly
   ```bash
   nginx -t
   ```

4. Rebuild and refresh frontend
   ```bash
   cd /root/clawd/captainclaw-saas/frontend && npm run build
   # Then Ctrl+Shift+R in browser
   ```

### Changes Not Showing

**Frontend:**
1. Rebuild: `npm run build`
2. Hard refresh: `Ctrl+Shift+R`
3. Clear browser cache if needed

**Backend:**
1. Changes auto-detected by nodemon
2. Service restarts automatically
3. If not: `systemctl restart captainclaw-backend`

---

## 📊 Monitoring

### Check All Services
```bash
# Backend
systemctl status captainclaw-backend

# NGINX
systemctl status nginx

# Database
ls -la /root/clawd/data/captainclaw/captainclaw.db
```

### View System Resources
```bash
# CPU/Memory usage
ps aux | grep -E "node|nginx"

# Port usage
netstat -tlnp | grep -E "80|3001"
```

---

## 🔄 Update Process

When deploying new code:

1. **Backend changes:**
   ```bash
   cd /root/clawd/captainclaw-saas/backend
   git pull origin main
   systemctl restart captainclaw-backend
   ```

2. **Frontend changes:**
   ```bash
   cd /root/clawd/captainclaw-saas/frontend
   git pull origin main
   npm install
   npm run build
   # Refresh browser
   ```

3. **Both:**
   Do backend first, then frontend (backend needs to be ready before frontend connects)

---

## 📝 Important Files

**Backend Service Definition**
```bash
/etc/systemd/system/captainclaw-backend.service
```

**NGINX Configuration**
```bash
/etc/nginx/sites-available/default
```

**Environment Configuration**
```bash
/root/clawd/captainclaw-saas/backend/.env
/root/clawd/captainclaw-saas/frontend/.env.production
```

---

## 🎯 Quick Commands Reference

```bash
# Check backend health
curl http://31.97.38.247/api/health

# Check if ports are available
lsof -i :80
lsof -i :3001
lsof -i :5173

# View backend logs
journalctl -u captainclaw-backend -f

# Restart everything
systemctl restart captainclaw-backend
nginx -s reload

# Deploy frontend
cd /root/clawd/captainclaw-saas/frontend && npm run build
```

---

## 🔒 Security Notes

- Database is SQLite (local file-based)
- Backend only listens on 0.0.0.0:3001 (proxied by NGINX)
- NGINX handles all external traffic
- Consider adding authentication to API endpoints (future)
- Database file permissions should be restricted

---

## 📞 Support

**Logs Location:**
- Backend: `journalctl -u captainclaw-backend`
- NGINX: `/var/log/nginx/access.log` and `error.log`
- Application: Check browser console (F12)

**Common Issues:**
- See "Troubleshooting" section above
- Check logs first: `journalctl -u captainclaw-backend -n 50`

---

*Built with ❤️ by Captain Claw* 🏴‍☠️
