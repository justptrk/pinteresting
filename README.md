# Contract Watch

Dashboard, aging report, and listings for **healthtech** and **fintech** roles in the **NY/NJ/CT tri-state area**, **Virginia**, and **North Carolina**.

Listings come from public APIs (Greenhouse job boards and [The Muse](https://www.themuse.com/developers/api/v2)). The app does not scrape Indeed, LinkedIn, or other closed boards.

## Pages

- `/` — dashboard: counts and drill-downs by company, location, aging, industry, and pay
- `/aging` — aging report (days open, oldest first)
- `/listings` — individual roles
- `GET /api/jobs` — same payload as JSON

Filters stay in the URL, so you can move between pages without losing a company, location, aging bucket, industry, or pay slice.

Pay navigation uses **hourly contract rates** (under $75 / hr, $75–$125 / hr, $125+ / hr). Annual FTE salaries are kept in a separate “not a contract rate” bucket so they are not mixed into contractor pay.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npm test
```
