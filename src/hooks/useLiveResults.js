import { useEffect, useRef, useState } from 'react';
import { MATCHES } from '../data/gameData';
import { toEnglish } from '../data/teamNames';

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
const CORS_PROXY = 'https://corsproxy.io/?url='; // fallback only — used if direct fetch is blocked by CORS
const POLL_MS = 30000; // 30s poll while tab is open

// Build a lookup: "TeamA__TeamB" (sorted alphabetically, lowercase) -> our match id
function buildMatchKey(teamA, teamB) {
  return [teamA, teamB].map(s => s.toLowerCase().trim()).sort().join('__');
}

const MATCH_LOOKUP = (() => {
  const map = {};
  MATCHES.forEach(m => {
    const key = buildMatchKey(toEnglish(m.home), toEnglish(m.away));
    map[key] = m.id;
  });
  return map;
})();

function parseEspnEvents(events) {
  // Returns { [ourMatchId]: { homeGoals, awayGoals, status: 'live'|'final'|'scheduled', clock, homeTeamEnglish, awayTeamEnglish, isHomeOnEspnHome } }
  const out = {};
  events.forEach(ev => {
    const comp = ev.competitions?.[0];
    if (!comp) return;
    const competitors = comp.competitors || [];
    const home = competitors.find(c => c.homeAway === 'home');
    const away = competitors.find(c => c.homeAway === 'away');
    if (!home || !away) return;

    const homeName = home.team?.displayName;
    const awayName = away.team?.displayName;
    if (!homeName || !awayName) return;

    const key = buildMatchKey(homeName, awayName);
    const ourMatchId = MATCH_LOOKUP[key];
    if (!ourMatchId) return;

    const statusType = comp.status?.type;
    const state = statusType?.state; // 'pre' | 'in' | 'post'
    let status = 'scheduled';
    if (state === 'in') status = 'live';
    if (state === 'post') status = 'final';

    const ourMatch = MATCHES.find(m => m.id === ourMatchId);
    const ourHomeIsEspnHome = toEnglish(ourMatch.home) === homeName;

    // ESPN returns score: "0" for matches that haven't started yet (not null/undefined),
    // so we must gate on status, not on the presence of a score value.
    const hasStarted = status === 'live' || status === 'final';
    const espnHomeGoals = hasStarted && home.score !== undefined ? Number(home.score) : null;
    const espnAwayGoals = hasStarted && away.score !== undefined ? Number(away.score) : null;

    out[ourMatchId] = {
      status,
      clock: comp.status?.displayClock || null,
      // Map back to our match's home/away orientation
      homeGoals: ourHomeIsEspnHome ? espnHomeGoals : espnAwayGoals,
      awayGoals: ourHomeIsEspnHome ? espnAwayGoals : espnHomeGoals,
    };
  });
  return out;
}

export function useLiveResults() {
  const [liveData, setLiveData] = useState({});
  const [lastFetch, setLastFetch] = useState(null);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchOnce = async () => {
    const url = `${ESPN_BASE}?dates=20260611-20260719&limit=300`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`ESPN API ${res.status}`);
      const json = await res.json();
      const parsed = parseEspnEvents(json.events || []);
      setLiveData(parsed);
      setLastFetch(Date.now());
      setError(null);
      return;
    } catch (e) {
      // Direct fetch failed (likely CORS in some browsers) — try a proxy fallback.
      try {
        const proxied = `${CORS_PROXY}${encodeURIComponent(url)}`;
        const res2 = await fetch(proxied);
        if (!res2.ok) throw new Error(`Proxy ${res2.status}`);
        const json2 = await res2.json();
        const parsed2 = parseEspnEvents(json2.events || []);
        setLiveData(parsed2);
        setLastFetch(Date.now());
        setError(null);
      } catch (e2) {
        setError(e2.message || e.message);
      }
    }
  };

  useEffect(() => {
    fetchOnce();
    intervalRef.current = setInterval(fetchOnce, POLL_MS);
    return () => clearInterval(intervalRef.current);
  }, []);

  return { liveData, lastFetch, error, refetch: fetchOnce };
}
