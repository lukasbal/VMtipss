// Maps Danish team names (used in our sheet/MATCHES) to English names used by ESPN's API.
// Used to match live ESPN events to our internal match list.

export const TEAM_NAME_MAP = {
  'Sydafrika': 'South Africa',
  'Mexico': 'Mexico',
  'Sydkorea': 'South Korea',
  'Tjekkiet': 'Czechia',
  'Canada': 'Canada',
  'Bosnien-Hercegovina': 'Bosnia and Herzegovina',
  'USA': 'United States',
  'Paraguay': 'Paraguay',
  'Qatar': 'Qatar',
  'Schweiz': 'Switzerland',
  'Brasillien': 'Brazil',
  'Brasilien': 'Brazil',
  'Marokko': 'Morocco',
  'Haiti': 'Haiti',
  'Skotland': 'Scotland',
  'Australien': 'Australia',
  'Tyrkiet': 'Türkiye',
  'Tyskland': 'Germany',
  'Curuçao': 'Curaçao',
  'Holland': 'Netherlands',
  'Japan': 'Japan',
  'Elfenbenskysten': 'Ivory Coast',
  'Ecuador': 'Ecuador',
  'Sverige': 'Sweden',
  'Tunesien': 'Tunisia',
  'Spanien': 'Spain',
  'Kap Verde': 'Cape Verde',
  'Belgien': 'Belgium',
  'Egypten': 'Egypt',
  'Saudi-Arabien': 'Saudi Arabia',
  'Uruguay': 'Uruguay',
  'Iran': 'Iran',
  'New Zealand': 'New Zealand',
  'Frankrig': 'France',
  'Senegal': 'Senegal',
  'Irak': 'Iraq',
  'Norge': 'Norway',
  'Argentina': 'Argentina',
  'Algeriet': 'Algeria',
  'Østrig': 'Austria',
  'Jordan': 'Jordan',
  'Portugal': 'Portugal',
  'DR Congo': 'Congo DR',
  'England': 'England',
  'Kroatien': 'Croatia',
  'Ghana': 'Ghana',
  'Panama': 'Panama',
  'Usbekistan': 'Uzbekistan',
  'Colombia': 'Colombia',
};

export function toEnglish(danishName) {
  return TEAM_NAME_MAP[danishName] || danishName;
}

export function toDanish(englishName) {
  const entry = Object.entries(TEAM_NAME_MAP).find(([, en]) => en === englishName);
  return entry ? entry[0] : englishName;
}
