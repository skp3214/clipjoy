# ClipJoy - Short-Form Video Platform

A modern short-form video platform built with the T3 stack (Next.js, TypeScript, tRPC, Tailwind CSS, and Prisma) featuring user authentication, video uploads, and social interactions.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS with DaisyUI components
- **Video Storage**: ImageKit for optimized video delivery
- **Forms**: React Hook Form for form handling
- **State Management**: TanStack Query (React Query) with tRPC

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with NextAuth.js
- 📤 **Video Upload** - Upload videos using ImageKit with progress tracking
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- ❤️ **Like System** - Like and unlike videos with real-time updates
- 🎥 **Video Feed** - Browse videos in a responsive grid layout
- 🔒 **Type Safety** - End-to-end type safety with tRPC and TypeScript
- 📊 **Database Relations** - Proper relational database design with Prisma

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- ImageKit account for video storage

### 1. Clone the Repository

```bash
git clone <repository-url>
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
DATABASE_URL="postgresql://username:password@localhost:5432/clipjoy"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# ImageKit
NEXT_PUBLIC_URL_ENDPOINT="your-imagekit-url"
NEXT_PUBLIC_PUBLIC_KEY="your-imagekit-public-key"
IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
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
- `id` - Unique identifier
- `email` - User email (unique)
- `password` - Hashed password
- `name` - Optional display name
- `image` - Profile image URL
- Timestamps: `createdAt`, `updatedAt`

### Videos Table
- `id` - Unique identifier
- `title` - Video title
- `description` - Video description
- `videoUrl` - ImageKit video path
- `thumbnailUrl` - Video thumbnail URL
- `userId` - Reference to user (optional)
- Video settings: `controls`, `height`, `width`, `quality`
- Timestamps: `createdAt`, `updatedAt`

### Likes Table
- `id` - Unique identifier
- `userId` - Reference to user
- `videoId` - Reference to video
- Unique constraint on `userId` and `videoId`

## 🎨 UI Components

- **VideoFeed** - Grid of video cards with loading states
- **VideoComponent** - Individual video card with like button
- **VideoUploadForm** - Video upload form with progress
- **FileUpload** - ImageKit file upload component
- **Notification** - Toast notifications system
- **Header** - Navigation with authentication

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

1. Set up PostgreSQL database on your hosting platform
2. Configure environment variables
3. Run database migrations: `npm run db:migrate`
4. Build and deploy: `npm run build`

## 📝 Migration from MongoDB

This project has been migrated from MongoDB to PostgreSQL with the following changes:

- **Database**: MongoDB → PostgreSQL with Prisma
- **API**: REST routes → tRPC procedures
- **Type Safety**: Manual types → Auto-generated from tRPC
- **State Management**: useEffect + fetch → TanStack Query with tRPC
- **Authentication**: Updated to use Prisma adapter

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using the T3 Stack (Next.js, TypeScript, tRPC, Tailwind CSS, Prisma)