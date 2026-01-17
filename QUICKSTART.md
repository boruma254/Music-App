# Quick Start Guide

## 🚀 Getting Started in 2 Minutes

### Option 1: Using VS Code Tasks (Recommended)

1. **Open the integrated terminal** in VS Code (Ctrl+\`)
2. **Run the task**:
   - Press `Ctrl+Shift+B` to open the task palette
   - Select "Start Frontend (Next.js)" or "Run Both Servers"

This will start:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### Option 2: Manual Terminal Commands

**Terminal 1 - Start Frontend**:

```bash
npm run dev
```

→ Opens at http://localhost:3000

**Terminal 2 - Start Backend**:

```bash
npm run backend
```

→ Running at http://localhost:3001

## 🔐 Login Credentials

**Demo Mode**: Use any email/password combination

Example:

- Email: `demo@example.com`
- Password: `password123`

## ✨ Features to Try

1. **Navigation**
   - Click sidebar tabs to switch sections
   - Click the "♫ Music" logo to cycle through tabs

2. **Home Tab**
   - Click playlist cards to select them
   - View the track list below

3. **Playlists/Albums/Artists**
   - View mock data cards

4. **User Menu**
   - Click your profile avatar (top-left corner)
   - Select "Logout" to return to login

## 📁 Project Structure

```
.
├── app/              → Next.js pages and layouts
├── components/       → React components
├── services/         → API service layer
├── types/            → TypeScript types
├── styles/           → Global CSS
├── backend/          → Mock Node.js server
└── public/           → Static assets
```

## 🔧 Useful Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Run ESLint
npm run backend      # Start mock backend
```

## 🎨 Customization

### Change Backend Port

Edit `backend/server.js`:

```javascript
const PORT = 3001; // Change this number
```

Also update `.env.local` in the root:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Modify Colors

Edit `tailwind.config.js` to adjust the color scheme

### Add Real Data

Replace mock data in `services/musicService.ts` with real API calls

## ⚡ Troubleshooting

**Port already in use?**

```bash
# Kill process on port 3000 (Windows PowerShell)
Get-Process -Name node | Stop-Process -Force

# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Dependencies error?**

```bash
# Clear npm cache and reinstall
npm cache clean --force
npm install
```

**Backend not connecting?**

- Check if both servers are running
- Verify URLs in `services/authService.ts`
- Check browser console for errors (F12)

## 📚 Next Steps

1. **Connect Real Backend**: Update endpoints in `services/authService.ts`
2. **Add Database**: Implement user persistence in backend
3. **Enhanced Features**: Add search, filtering, music playback
4. **Styling**: Customize colors and layout to match your design

---

For more details, see [README.md](./README.md)
