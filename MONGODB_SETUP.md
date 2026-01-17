# MongoDB Setup Guide

## Overview

Your Music App now uses MongoDB for persistent data storage. You have two options to run MongoDB:

1. **MongoDB Atlas (Cloud) - Recommended for beginners** ✅ Easy, free tier available
2. **Local MongoDB** - Best for development, requires installation

---

## Option 1: MongoDB Atlas (Recommended)

### Step 1: Create a Free MongoDB Atlas Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign Up Free"
3. Complete registration
4. Verify your email

### Step 2: Create a Cluster

1. After login, click "Create" to build a new database
2. Select the free **M0 Cluster** option
3. Choose your cloud provider (AWS, Azure, or Google Cloud - any works)
4. Choose a region close to you
5. Click "Create Cluster" (takes 1-3 minutes)

### Step 3: Create Database User

1. In the left sidebar, click "Security" → "Database Access"
2. Click "Add New Database User"
3. Enter:
   - **Username**: `musicapp`
   - **Password**: Create a strong password (save this!)
   - **Built-in Role**: "Read and write to any database"
4. Click "Add User"

### Step 4: Allow Network Access

1. In the left sidebar, click "Security" → "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (OK for development)
4. Click "Confirm"

### Step 5: Get Connection String

1. Click "Databases" in the left sidebar
2. Click "Connect" button on your cluster
3. Select "Connect your application"
4. Choose Node.js as the driver
5. Copy the connection string

It should look like:

```
mongodb+srv://musicapp:YOUR_PASSWORD@cluster0.mongodb.net/music-app?retryWrites=true&w=majority
```

### Step 6: Update Your .env.local

Create or update `.backend/.env.local`:

```
MONGODB_URI=mongodb+srv://musicapp:YOUR_PASSWORD@cluster0.mongodb.net/music-app?retryWrites=true&w=majority
```

Replace:

- `YOUR_PASSWORD` with your database password from Step 3

### Step 7: Seed the Database

```bash
cd backend
npm run seed
```

You should see:

```
✅ Created 5 artists
✅ Created 5 albums
✅ Created 6 tracks
✅ Created 2 users
✅ Created 3 playlists

🎉 Database seeded successfully!
```

---

## Option 2: Local MongoDB

### Step 1: Download and Install MongoDB Community

1. Visit [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
2. Select:
   - **OS**: Windows
   - **Version**: Latest (recommended)
3. Click "Download"
4. Run the installer
5. Select "Complete" installation
6. Accept MongoDB as a service (recommended)

### Step 2: Verify Installation

```bash
mongod --version
```

Should show version information.

### Step 3: Start MongoDB Service

MongoDB runs as a Windows service automatically after installation.

To verify it's running:

```bash
# Should return without error
mongo --eval "db.adminCommand('ping')"
```

### Step 4: Update .env.local

Create or update `backend/.env.local`:

```
MONGODB_URI=mongodb://localhost:27017/music-app
```

### Step 5: Seed the Database

```bash
cd backend
npm run seed
```

---

## Running the App with MongoDB

### Start Backend Server

```bash
cd backend
npm run dev
```

You should see:

```
✅ MongoDB connection successful
🎵 Backend server running on http://localhost:3001
```

### Start Frontend

In a new terminal:

```bash
npm run dev
```

### API Endpoints Available

**Authentication:**

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (demo@example.com / demo123)
- `POST /api/auth/logout` - Logout user

**Data:**

- `GET /api/playlists?userId=<id>` - Get user's playlists
- `GET /api/tracks` - Get all tracks
- `GET /api/albums` - Get all albums
- `GET /api/artists` - Get all artists

---

## Test Login

After seeding, use these demo credentials:

**User 1:**

- Email: `demo@example.com`
- Password: `demo123`

**User 2:**

- Email: `test@example.com`
- Password: `test123`

---

## MongoDB Compass (Optional)

For visual database management:

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. For **Atlas**: Use your connection string from Step 5
3. For **Local**: Use `mongodb://localhost:27017`
4. Browse your data, collections, and documents visually

---

## Troubleshooting

### Error: "MongoDB connection failed: ECONNREFUSED"

- **MongoDB Atlas**: Check username/password and IP whitelist
- **Local MongoDB**: Ensure mongod service is running

### Error: "Authentication failed"

- Verify correct username and password in connection string
- Check database user has "Read and write" permissions

### No data after seed?

- Run: `npm run seed` again
- Check for errors in console output
- Verify connection string is correct

### Port already in use?

```bash
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## Next Steps

1. ✅ Seed database with initial data
2. Update frontend authentication to use real database
3. Add password reset functionality
4. Implement user profile pages
5. Add search/filter features
6. Uncomment Spotify integration

---

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
