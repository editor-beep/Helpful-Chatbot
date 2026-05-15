# Helpful-Chatbot
An AI for haters of AI

## Security note
This project uses a Vercel server endpoint (`/api/chat`) as a backend proxy to Gemini.
The Gemini API key is server-only (`GEMINI_API_KEY`) and must never be exposed to browser code.

## Environment variables
Create local environment config for Vercel dev:

```bash
cp .env.example .env.local
```

Set:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

In Vercel, add the same variable in Project Settings → Environment Variables:

- `GEMINI_API_KEY` (Production / Preview / Development as needed)

## Vercel deployment
1. Import this repository into Vercel.
2. Configure `GEMINI_API_KEY` in environment variables.
3. Deploy.

Frontend requests go to `/api/chat`, and that endpoint calls Gemini on the server side.
