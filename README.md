# SoCal OpenRoster

A web platform that connects Southern California club players and coaches. Players can create profiles with team/level/position information, upload highlight media, and message coaches. Coaches can create team profiles, post tryout dates and guest-player needs, and message players.

## Features

### Core Features
- ✅ **User Authentication**: Email/password sign-up with email verification
- ✅ **Role-Based Access**: Separate profiles for Players and Coaches
- ✅ **Player Profiles**: Team, position, level, age group, contact info, and media uploads
- ✅ **Coach Profiles**: Club, team name, level, record, contact info, and media uploads
- ✅ **Public Directories**: Searchable player and coach directories with filters
- ✅ **Coach Posts**: Tryout announcements and guest player needs
- ✅ **In-Site Messaging**: Real-time messaging between users with read receipts
- ✅ **Email Verification**: Profiles become visible and messaging unlocks after verification

### Filtering & Search
- Search players by age group, level, position
- Search coaches/teams by level
- Sort by newest or most active
- Full-text search on names, teams, clubs

### User Permissions
- **Players**: Can create profiles, upload media, message coaches
- **Coaches**: Can create profiles, post tryouts/needs, message players
- **Visitors**: Can browse/search public profiles and coach posts (must sign in to message)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Auth.js)
- **Real-time**: Pusher (configured but optional for MVP)
- **Styling**: Tailwind CSS with custom SoCal color palette (red #D21F3C, blue #1A56DB)

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- (Optional) AWS S3 for media uploads
- (Optional) Email service (Resend, SendGrid) for verification emails

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kamranyash/Soccer-Communication.git
   cd Soccer-Communication
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/socal_openroster"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Email (for verification)
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@example.com"
   EMAIL_SERVER_PASSWORD="your-password"
   EMAIL_FROM="noreply@socalopenroster.com"
   
   # AWS S3 (optional - for media uploads)
   AWS_ACCESS_KEY_ID="your-access-key"
   AWS_SECRET_ACCESS_KEY="your-secret-key"
   AWS_REGION="us-west-2"
   AWS_S3_BUCKET_NAME="socal-openroster-media"
   
   # Pusher (optional - for real-time messaging)
   PUSHER_APP_ID="your-app-id"
   PUSHER_KEY="your-key"
   PUSHER_SECRET="your-secret"
   PUSHER_CLUSTER="us2"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── players/      # Player-related endpoints
│   │   ├── coaches/      # Coach-related endpoints
│   │   ├── posts/        # Post-related endpoints
│   │   └── messages/     # Messaging endpoints
│   ├── auth/             # Authentication pages
│   ├── players/          # Player directory and profiles
│   ├── coaches/          # Coach directory and profiles
│   ├── posts/            # Coach posts pages
│   ├── messages/         # Messaging interface
│   └── profile/          # User profile management
├── components/           # Reusable React components
├── lib/                  # Utility functions and configurations
├── prisma/              # Prisma schema and migrations
└── types/               # TypeScript type definitions
```

## Database Schema

The application uses Prisma with PostgreSQL. Key models:
- `User`: Authentication and role management
- `PlayerProfile`: Player information and media
- `CoachProfile`: Coach information, posts, and media
- `Post`: Tryout and guest player announcements
- `Conversation` & `Message`: In-site messaging
- `MediaAsset`: Uploaded photos, videos, and links
- `Favorite`: Saved profiles/posts
- `Report`: User reporting system
- `Activity`: Activity tracking for sorting

## Future Enhancements (Phase 2)

- Save/favorite profiles
- Export contact CSV
- Basic analytics for post views
- Optional coach references/reviews
- Map view for tryouts
- Enhanced media upload with video processing
- Push notifications
- Advanced search with multiple filters
- Profile views tracking

## Contributing

This is a private project, but suggestions and feedback are welcome!

## License

Private - All rights reserved

## Support

For issues or questions, please contact the project maintainer.

