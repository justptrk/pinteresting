# Contract Watch

Tracks **companies hiring contractors** in **Virginia**, the **NY/NJ/CT tri-state area**, and **North Carolina**.

The default view is contractor / 1099 / C2C / fixed-term only. Permanent salary bands are not the pay filter; hourly contract rates are.

## Pages

- `/` — companies and states with open contractor roles
- `/aging` — how long those contractor reqs have been open
- `/listings` — individual contractor listings
- `GET /api/jobs` — same payload as JSON

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
