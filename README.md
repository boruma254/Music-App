# Music Browser - Full Stack Application

A beautiful music browser UI built with Next.js and Tailwind CSS, featuring a mock Node.js backend.

## Features

- **Modern UI**: Dark-themed interface with gradient accents (purple & blue)
- **Login System**: Email/password login with mock backend authentication
- **Sidebar Navigation**: Home, Playlists, Albums, Artists tabs with logo cycling
- **Responsive Layout**: Left sidebar (navigation) + right content area
- **Mock Backend**: Node.js server with simulated API endpoints
- **Clean Architecture**: Well-structured services and components for easy backend integration

## Project Structure

```
├── app/                    # Next.js app router & pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main app page
├── components/            # React components
│   ├── LoginModal.tsx     # Login modal
│   ├── Sidebar.tsx        # Left sidebar navigation
│   ├── MainContent.tsx    # Main content area
│   └── tabs/              # Tab content components
│       ├── HomeTab.tsx
│       ├── PlaylistsTab.tsx
│       ├── AlbumsTab.tsx
│       └── ArtistsTab.tsx
├── services/              # API service layer
│   ├── authService.ts     # Authentication service
│   └── musicService.ts    # Music data service
├── types/                 # TypeScript type definitions
├── styles/                # Global styles
├── backend/               # Mock Node.js backend
│   └── server.js
├── public/                # Static assets
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS config
└── package.json
```

## Installation

### Prerequisites

- Node.js 18+ and npm

### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup (in a new terminal)

```bash
# Install backend dependencies
npm install express cors

# Start the mock backend server
npm run backend
```

The backend will run on `http://localhost:3001`

## Usage

1. **Start both servers**:
   - Terminal 1: `npm run dev` (Next.js frontend)
   - Terminal 2: `npm run backend` (Mock backend)

2. **Login**: Use any email and password to login (demo mode accepts all credentials)

3. **Navigation**:
   - Click tabs in the sidebar to switch sections
   - Click the logo (♫ Music) to cycle through Home → Albums → Playlists → Artists
   - Click user avatar to logout

## Features Implemented

### Frontend

- ✅ Responsive sidebar with 4 tabs
- ✅ Tab switching functionality
- ✅ Logo click cycles through tabs
- ✅ Login modal with form validation
- ✅ Home tab with playlist selector and track list
- ✅ Playlists, Albums, Artists tabs with mock data
- ✅ User menu with logout option
- ✅ Dark theme with purple/blue gradients
- ✅ Tailwind CSS styling

### Backend

- ✅ Express.js server running on port 3001
- ✅ `/api/auth/login` endpoint
- ✅ Mock user authentication
- ✅ CORS enabled for frontend communication
- ✅ Health check endpoint

## Easy Backend Integration

The app is designed to be easily extended with a real backend:

1. **Authentication**: Update `services/authService.ts` to call your real backend endpoints
2. **Music Data**: Replace mock data in `services/musicService.ts` with real API calls
3. **User Persistence**: Add session storage or JWT tokens as needed
4. **Database**: Connect backend to your database without changing frontend structure

## Demo Credentials

In demo mode, the app accepts any email/password combination. In production:

- Create actual user accounts
- Implement proper password hashing
- Add JWT or session-based authentication

## Available Scripts

```bash
npm run dev      # Start Next.js development server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Run ESLint
npm run backend  # Start mock backend server
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Notes

- No data is persisted on page refresh (as per requirements)
- Mock backend returns dummy data for all music endpoints
- Styling uses Tailwind CSS with custom dark theme
- All components use React hooks (no class components)

## Future Enhancements

- Real database integration
- Persistent user authentication
- Music playback functionality
- Search and filtering
- User preferences and settings
- Real music data API integration
