# Quick Start - MongoDB

## 5-Minute Setup

### 1. Choose Your Database

**Option A: MongoDB Atlas (Cloud) - Easiest**

- Free forever (shared cluster)
- No installation needed
- Automatic backups

**Option B: Local MongoDB**

- Full control
- Faster for development
- Requires installation

### 2. Setup (Choose One)

#### Atlas

```bash
# 1. Create account at https://www.mongodb.com/cloud/atlas
# 2. Create free cluster M0
# 3. Create database user (musicapp / password)
# 4. Allow network access from anywhere
# 5. Copy connection string

# 6. Create backend/.env
MONGODB_URI=mongodb+srv://musicapp:PASSWORD@cluster0.mongodb.net/music-app?retryWrites=true&w=majority

# 7. Seed database
cd backend && npm run seed
```

#### Local

```bash
# 1. Download MongoDB Community at https://www.mongodb.com/try/download/community
# 2. Install (defaults to Windows service)

# 3. Create backend/.env
MONGODB_URI=mongodb://localhost:27017/music-app

# 4. Seed database
cd backend && npm run seed
```

### 3. Start App

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev

# Visit http://localhost:3000
```

### 4. Login

**Demo Credentials (after seeding):**

- Email: `demo@example.com`
- Password: `demo123`

---

## Seed Command Explained

```bash
npm run seed
```

Creates:

- ✅ 5 Artists
- ✅ 5 Albums
- ✅ 6 Tracks
- ✅ 2 Users
- ✅ 3 Playlists

Expected output:

```
✅ MongoDB connection successful
✅ Created 5 artists
✅ Created 5 albums
✅ Created 6 tracks
✅ Created 2 users
✅ Created 3 playlists

🎉 Database seeded successfully!
```

---

## API Endpoints

### Register

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"Your Name"}'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'
```

### Get Playlists

```bash
curl "http://localhost:3001/api/playlists?userId=USER_ID"
```

### Get All Tracks

```bash
curl "http://localhost:3001/api/tracks"
```

### Health Check

```bash
curl "http://localhost:3001/api/health"
```

---

## Troubleshooting

| Error                    | Solution                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| **ECONNREFUSED**         | Is MongoDB running? Atlas: Check IP whitelist & credentials. Local: Start mongod service. |
| **E11000 duplicate key** | Email already exists. Use different email.                                                |
| **No data after seed**   | Run `npm run seed` again. Check backend logs.                                             |
| **Login fails silently** | Kill node processes. Restart backend. Clear browser cache.                                |

---

## Next: Spotify Integration

To enable Spotify music fetching:

1. Uncomment code in `backend/server.js` (search for `SPOTIFY`)
2. Uncomment code in `components/LoginModal.tsx` (search for `Spotify`)
3. Add Spotify credentials to `.env.local`:
   ```
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_id
   SPOTIFY_CLIENT_SECRET=your_secret
   ```
4. Restart backend

See `SPOTIFY_SETUP.md` for details.

---

## Useful Commands

```bash
# Seed database (fresh data)
cd backend && npm run seed

# Start backend server
cd backend && npm run dev

# View MongoDB (if local)
mongosh

# Check API health
curl http://localhost:3001/api/health

# Kill process on port (if stuck)
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## File Locations

- **Backend env**: `backend/.env`
- **Frontend env**: `.env.local`
- **Seed script**: `backend/seed.js`
- **Models**: `backend/models/index.js`
- **Routes**: `backend/server.js`
- **API Service**: `services/musicService.ts`

---

**Ready to go!** Follow setup steps above and you'll be running with real database in 5 minutes.
