# Triangle Workforce - Jobs Page + AI Chatbot

## What's Included

- **`jobs-page/jobs.html`** — Interactive job listings page with search, filters, and an AI chatbot
- **`jobs-page/jobs.json`** — Your job listings data (edit this to add/remove/update positions)
- **`netlify/functions/chat.js`** — Netlify serverless function that powers the AI chatbot via Claude API
- **`netlify.toml`** — Netlify configuration for the serverless function

## Setup Steps

### 1. Add to Your Netlify Site

Copy these files into your existing Netlify site repository:
- `jobs-page/` folder → your site root
- `netlify/` folder → your site root
- `netlify.toml` → your site root (merge with existing if you have one)

### 2. Set Up the Claude API Key

In your Netlify dashboard:
1. Go to **Site settings → Environment variables**
2. Add: `ANTHROPIC_API_KEY` = your Claude API key
3. Get a key at https://console.anthropic.com/

### 3. Link from Your Site

Add a link to the jobs page from your main navigation:
```html
<a href="/jobs-page/jobs.html">Jobs</a>
```

Or embed it in an existing page with an iframe:
```html
<iframe src="/jobs-page/jobs.html" width="100%" height="800" frameborder="0"></iframe>
```

### 4. Managing Job Listings

Edit `jobs-page/jobs.json` to add, update, or remove positions. Each job has:

```json
{
  "id": "unique-id",
  "title": "Job Title",
  "business": "Business Name",
  "location": "Chapel Hill or Carrboro",
  "category": "Restaurant or Retail",
  "type": "Full-Time or Part-Time",
  "pay": "$XX - $XX/hr",
  "description": "Job description text",
  "requirements": ["Requirement 1", "Requirement 2"],
  "posted": "2026-03-01",
  "contact": "jobs@triangleworkforce.com"
}
```

### 5. Chatbot Capabilities

The AI chatbot can:
- Answer questions about any listed position
- Help match visitors to jobs based on their skills/preferences
- Collect candidate info (name, email, phone)
- Accept resume uploads (file attachment)
- Direct visitors to contact you for anything outside its scope

### Cost

The chatbot uses Claude Haiku 4.5 (~$0.001 per conversation turn), so costs are minimal even with moderate traffic.
