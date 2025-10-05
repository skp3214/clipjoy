# ClipJoy - Short-Form Video Platform

A modern short-form video platform built with the T3 stack (Next.js, TypeScript, tRPC, Tailwind CSS, and Prisma) featuring user authentication, video uploads, and social interactions.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, TypeScript
- **Backend**: tRPC for type-safe APIs
- **Database**: NeonDB (PostgreSQL) with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS with DaisyUI components
- **Video Storage**: Database-based video storage with streaming API
- **Forms**: React Hook Form for form handling
- **State Management**: TanStack Query (React Query) with tRPC

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with NextAuth.js
- 📤 **Video Upload** - Direct video upload to database with progress tracking
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- ❤️ **Like System** - Like and unlike videos with real-time updates
- 🎥 **Video Feed** - Browse videos in a responsive grid layout
- 🔒 **Type Safety** - End-to-end type safety with tRPC and TypeScript
- 📊 **Database Relations** - Proper relational database design with Prisma
- 🎬 **Video Streaming** - Custom API endpoint with range request support for video seeking

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- NeonDB PostgreSQL database account

### 1. Clone the Repository

```bash
git clone https://github.com/skp3214/clipjoy.git
cd clipjoy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env.local` and configure:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
clipjoy/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── trpc/         # tRPC API handler
│   ├── components/        # React components
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── upload/           # Video upload page
│   └── videos/           # Video pages
├── lib/                   # Utility libraries
│   ├── routers/          # tRPC routers
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── trpc.ts           # tRPC setup
│   └── trpc-client.ts    # Client-side tRPC
├── prisma/               # Database schema and migrations
└── types.d.ts           # TypeScript type definitions
```

## 🔄 API Routes (tRPC)

### Authentication Routes
- `auth.register` - User registration
- `auth.getProfile` - Get user profile
- `auth.updateProfile` - Update user profile (not used in the code)

### Video Routes
- `video.getAll` - Get all videos with like counts
- `video.getById` - Get single video by ID
- `video.create` - Create new video
- `video.update` - Update video (owner only) (not used in the code)
- `video.delete` - Delete video (owner only) (not used in the code)
- `video.toggleLike` - Like/unlike video

## 🗄️ Database Schema

### Users Table
- `id` - Unique identifier (cuid)
- `email` - User email (unique)
- `password` - Hashed password
- `name` - Optional display name
- `image` - Profile image URL
- `emailVerified` - Email verification timestamp
- Relations: `accounts`, `sessions`, `videos`, `likes`
- Timestamps: `createdAt`, `updatedAt`

### Videos Table
- `id` - Unique identifier (cuid)
- `title` - Video title
- `description` - Video description
- `videoData` - Binary video data stored in database (Bytes)
- `videoUrl` - Video URL (fallback for existing videos)
- `thumbnailUrl` - Video thumbnail URL
- `fileName` - Original filename
- `mimeType` - Video MIME type (video/mp4, video/webm, etc.)
- `fileSize` - File size in bytes
- `userId` - Reference to user (optional)
- Video settings: `controls`, `height`, `width`, `quality`
- Relations: `user`, `likes`
- Timestamps: `createdAt`, `updatedAt`

### Likes Table
- `id` - Unique identifier (cuid)
- `userId` - Reference to user
- `videoId` - Reference to video
- Relations: `user`, `video`
- Unique constraint on `userId` and `videoId`

### Accounts Table (NextAuth.js)
- `id` - Unique identifier (cuid)
- `userId` - Reference to user
- `type` - Account type
- `provider` - OAuth provider (Google, GitHub, etc.)
- `providerAccountId` - Provider's account ID
- `refresh_token` - OAuth refresh token
- `access_token` - OAuth access token
- `expires_at` - Token expiration
- `token_type` - Type of token
- `scope` - OAuth scope
- `id_token` - ID token
- `session_state` - Session state
- Relations: `user`
- Unique constraint on `provider` and `providerAccountId`

### Sessions Table (NextAuth.js)
- `id` - Unique identifier (cuid)
- `sessionToken` - Session token (unique)
- `userId` - Reference to user
- `expires` - Session expiration
- Relations: `user`

### VerificationToken Table (NextAuth.js)
- `identifier` - Token identifier
- `token` - Verification token (unique)
- `expires` - Token expiration
- Unique constraint on `identifier` and `token`

## 🎨 UI Components

- **VideoFeed** - Grid of video cards with loading states
- **VideoComponent** - Individual video card with like button
- **VideoUploadForm** - Video upload form with progress
- **FileUpload** - Native file upload component with validation
- **Notification** - Toast notifications system
- **Header** - Navigation with authentication

## 🎬 Video Streaming

Videos are stored as binary data in the PostgreSQL database and served through a custom streaming API at `/api/video/[id]` that supports:
- Range requests for video seeking
- Proper MIME type headers
- Efficient video streaming for web players

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
```

## 🚀 Deployment

1. Set up NeonDB PostgreSQL database on [Neon](https://neon.tech)
2. Configure environment variables with your database URL
3. Run database migrations: `npm run db:push`
4. Build and deploy: `npm run build`

## � Notes

- Videos are stored directly in the database for files under 100MB
- Custom video streaming API provides efficient playback with seeking support
- No external CDN dependencies for video storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request


