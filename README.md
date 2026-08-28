# Contract Watch

Tracks **healthtech** and **fintech** contract-style jobs in the **NY/NJ/CT tri-state area**, **Virginia**, and **North Carolina**.

Listings come from public APIs (Greenhouse job boards and [The Muse](https://www.themuse.com/developers/api/v2)). The app does not scrape Indeed, LinkedIn, or other closed boards.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Contract / 1099 / C2C / temporary is on by default.
- Uncheck that filter to see other in-scope roles at the same companies and locations.
- `GET /api/jobs` returns the same payload as JSON.

## Tests

```bash
npm test
```
