# Rugby AI

An AI-powered rugby team management application built with Next.js and Google AI.

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd rugby-ai
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory with the following variables:

```env
GOOGLE_AI_API_KEY=your_google_ai_api_key
TEAM_NAME=your_team_name
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

**Required environment variables:**

- `GOOGLE_AI_API_KEY` - API key for Google AI services
- `TEAM_NAME` - Your rugby team name
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob read/write token for image uploads

4. **Start the development server**

```bash
pnpm dev
```

5. **Open the application**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- AI-powered chat interface for rugby team management
- Multi-flow image generation (lineup/result x story/post)
- Real-time AI responses with streaming
- Modern UI with Radix UI components

## Tech Stack

- **Framework:** Next.js 16
- **AI:** Google AI SDK, Vercel AI SDK
- **UI:** React 19, Radix UI, Tailwind CSS
- **Language:** TypeScript

## Project Structure

```
rugby-ai/
├── src/
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── tools/        # AI tools and clients
│   └── lib/          # Utilities and prompts
└── public/           # Static assets
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
