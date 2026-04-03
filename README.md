# OpsAI – AI-Powered Internal Operations Assistant

An AI-powered web application built to improve internal operational efficiency using Google Gemini AI. Built with Next.js 14, TypeScript, Tailwind CSS, and Docker.

## Features

- **Meeting Notes Summarizer** – Paste raw notes, get structured action items and decisions
- **Internal Memo Drafting** – AI-generated professional internal communications
- **Task Priority Analyzer** – AI ranks tasks by urgency and impact
- **Document Q&A** – Ask questions about any internal document or policy

## Tech Stack

- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Google Gemini AI API (gemini-1.5-flash)
- Docker + Docker Compose
- GCP-ready deployment

## Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop (optional)
- Google Gemini API Key ([Get here](https://aistudio.google.com))

### Local Development

1. Clone the repository
```bash
   git clone https://github.com/ASK3002/OpsAI.git
   cd OpsAI
```

2. Install dependencies
```bash
   npm install
```

3. Create `.env.local` file
```env
   GEMINI_API_KEY=your_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server
```bash
   npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Docker
```bash
docker-compose up --build
```

## Deployment

See below for Vercel/Render deployment steps.

## License

MIT