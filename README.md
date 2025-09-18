# AI Video Generator

A modern web application for generating AI-powered videos using Next.js, TypeScript, and TailwindCSS.

## Features

- 🎬 **AI Video Generation**: Create professional videos from text prompts using AI
- 📱 **Responsive Design**: Beautiful, mobile-first UI built with TailwindCSS
- 🔐 **Authentication**: Secure login with NextAuth.js (Google + Email)
- 💳 **Subscription Plans**: Free and Pro tiers with Stripe integration
- 📊 **Dashboard**: Manage videos, view analytics, and track usage
- 🎨 **Templates**: Pre-built video templates for different use cases
- ⚡ **Real-time Processing**: Live updates during video generation

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Storage**: Supabase Storage (or AWS S3)
- **AI Video APIs**: RunwayML, Pika, Stability AI, or OpenAI Sora

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account
- AI Video Generation API access

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ai-video-generator
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env.example .env.local
```

4. Configure your `.env.local` file with:

   - Database connection string
   - NextAuth.js secrets
   - Google OAuth credentials
   - Stripe API keys
   - AI Video API keys
   - Storage configuration

5. Set up the database:

```bash
npx prisma db push
npx prisma generate
```

6. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── Navbar.tsx        # Navigation component
│   ├── Footer.tsx        # Footer component
│   └── ...
├── lib/                  # Utility functions and configurations
│   ├── auth.ts           # NextAuth.js configuration
│   ├── db.ts             # Database connection
│   ├── stripe.ts         # Stripe configuration
│   └── utils.ts          # Utility functions
├── data/                 # Static data files
│   └── presets.json      # Video template presets
└── styles/               # Global styles
    └── globals.css       # TailwindCSS imports
```

## Key Features

### Video Generation

- Choose from pre-built templates
- Customize with text prompts and settings
- Real-time generation progress
- Download generated videos

### User Management

- Secure authentication with Google and email
- User profiles and preferences
- Usage tracking and limits

### Subscription Management

- Free tier: 3 videos/month with watermarks
- Pro tier: Unlimited videos, HD quality, no watermarks
- Stripe-powered billing and payments

### Dashboard

- Video library with search and filtering
- Usage analytics and statistics
- Billing and subscription management

## API Integration

### AI Video Generation

The app integrates with various AI video generation APIs:

- **RunwayML**: High-quality video generation
- **Pika**: Fast video creation
- **Stability AI**: Creative video effects
- **OpenAI Sora**: Advanced AI video (when available)

### Example Integration

```typescript
async function generateVideo(prompt: string, settings: VideoSettings) {
  const response = await fetch("https://api.runwayml.com/v1/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      ...settings,
    }),
  });

  return response.json();
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@aivideogenerator.com or create an issue in the GitHub repository.
