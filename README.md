# VM Tips 2026 🏆

Live leaderboard app for the 2026 World Cup tips competition.

## Players
Jeppe, Christian Qvist, Paddy, Lukas, Chrilled, Chrisser, Magnor (Von Thistle)

## Features
- 🏅 Live leaderboard with group points + bonus points
- 🔴 **Automatic live results** — pulls real scores from ESPN's free public scoreboard API every 30 seconds, no API key needed
- **Live (+X pts) highlight** — while a match is in progress, anyone whose prediction matches the current score gets a flashing `(+X pts)` next to their name on the leaderboard, so you can watch points roll in live
- ⚽ All 72 group stage matches — see who predicted what
- 👤 Player detail view with per-match breakdown
- ⭐ Bonus rounds tracker (group finishes, R16, QF, SF, top scorer, winner)
- ✏️ Admin panel to manually correct results if needed (auto-sync is the default; manual entry overrides it)
- 🌑 Dark mode throughout

## How live results work

The app polls `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard` — ESPN's free, public, no-key scoreboard endpoint — every 30 seconds while the app is open. It matches matches by team name to your prediction sheet automatically.

- **No setup required** — works the moment you deploy
- **No cost** — this is a free public endpoint
- **Manual override available** — if ESPN's data is ever wrong, missing, or delayed, use the ✏️ Resultater panel to correct it; manual entries always take priority over the live feed
- If the live fetch is ever blocked by a browser's CORS policy, the app automatically retries through a public CORS proxy. If both fail, a small warning banner appears and you can fall back to manual entry — nothing else breaks
- Since this is an unofficial/undocumented ESPN endpoint, it could theoretically change without notice; the manual entry panel is always there as a backup


## Scoring Rules
| Event | Points |
|---|---|
| Correct outcome (1X2) | 3 |
| Correct goal per digit | 2 |
| Exact score bonus | 1 |
| Group placement (bonus 1) | 10 |
| R16 participant (bonus 2) | 15 |
| Quarterfinal (bonus 3) | 20 |
| Semifinal (bonus 4) | 30 |
| Top scorer (bonus 5) | 40 |
| Tournament winner (bonus 5) | 50 |

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json` scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. Add `base` to `vite.config.js`:
```js
base: '/YOUR-REPO-NAME/',
```

4. Deploy:
```bash
npm run deploy
```

## How to use

- Open the app — everyone can see the live leaderboard and match predictions, updating automatically as real matches happen
- Watch the leaderboard during a live match — anyone whose prediction matches the current score shows a flashing `(+X pts)` next to their name
- Click **✏️ Resultater** only if you need to correct or manually add a result ESPN's feed missed
- Click **⭐ Bonus** to enter knockout round results as the tournament progresses (no free live source covers these long-term bonus bets, so they stay manual)
- Tap any player on the leaderboard to see their full prediction breakdown
- Tap any match in the Matches tab to see all 7 predictions side by side, with a 🔴 LIVE badge and match clock while it's in progress

## Data

All predictions are pre-loaded from the Excel sheet. Results are saved locally in the browser via `localStorage` — if you want the scores to sync between devices, host it somewhere (GitHub Pages, Vercel, Netlify) and consider adding a simple backend or using a shared Google Sheet as a data source.
