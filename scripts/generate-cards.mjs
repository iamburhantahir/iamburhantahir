// Generates Devfinix-branded trophy and contribution-graph SVGs from live GitHub data.
// Run in CI:  GITHUB_TOKEN=... GH_USER=iamburhantahir OUT_DIR=dist node scripts/generate-cards.mjs
// Preview:    MOCK=1 OUT_DIR=preview node scripts/generate-cards.mjs
import { mkdir, writeFile } from "node:fs/promises";

const USER = process.env.GH_USER || "iamburhantahir";
const OUT = process.env.OUT_DIR || "dist";

const C = {
  bg: "#0A0A0F", card: "#111114", border: "#2A2A32",
  text: "#F5F5F7", muted: "#A0A0B8", lime: "#C9F31D", limeDim: "#A8CC18", limeDark: "#7A9A0E",
};
const FONT = "'Segoe UI', Inter, Helvetica, Arial, sans-serif";

const QUERY = `query($login: String!) {
  user(login: $login) {
    name createdAt
    followers { totalCount }
    pullRequests { totalCount }
    issues { totalCount }
    repositories(ownerAffiliations: OWNER, first: 100, isFork: false) {
      totalCount nodes { stargazerCount }
    }
    contributionsCollection {
      totalCommitContributions restrictedContributionsCount
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
    }
  }
}`;

async function fetchUser() {
  if (process.env.MOCK) return mockUser();
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${process.env.GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { login: USER } }),
  });
  const json = await res.json();
  if (!json.data?.user) throw new Error(`GitHub API error: ${JSON.stringify(json.errors || json)}`);
  return json.data.user;
}

function mockUser() {
  const days = [];
  const start = new Date(Date.now() - 364 * 864e5);
  for (let i = 0; i < 365; i++) {
    days.push({ date: new Date(+start + i * 864e5).toISOString().slice(0, 10), contributionCount: Math.max(0, Math.round(8 * Math.sin(i / 5) + Math.random() * 10 - 2)) });
  }
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push({ contributionDays: days.slice(i, i + 7) });
  return {
    name: "Burhan Tahir", createdAt: "2019-01-10T00:00:00Z",
    followers: { totalCount: 28 }, pullRequests: { totalCount: 64 }, issues: { totalCount: 12 },
    repositories: { totalCount: 67, nodes: [{ stargazerCount: 40 }] },
    contributionsCollection: {
      totalCommitContributions: 900, restrictedContributionsCount: 400,
      contributionCalendar: { totalContributions: 1600, weeks },
    },
  };
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));

// ---------------------------------------------------------------- trophies
const RANKS = ["C", "B", "A", "AA", "AAA", "S", "SS", "SSS"];

function rankFor(value, steps) {
  let r = -1;
  steps.forEach((min, i) => { if (value >= min) r = i; });
  return r; // -1 = locked
}

function trophyCard(t, i) {
  const x = i * 120;
  const r = rankFor(t.value, t.steps);
  const rank = r < 0 ? "?" : RANKS[r];
  const cup = r >= 5 ? C.lime : r >= 2 ? C.limeDim : r >= 0 ? C.muted : C.border;
  const d = (0.1 + i * 0.12).toFixed(2);
  return `
  <g transform="translate(${x} 6)">
    <g class="pop" style="animation-delay:${d}s">
      <rect x="4" y="4" width="112" height="132" rx="14" fill="${C.card}" stroke="${C.border}"/>
      ${r >= 5 ? `<rect x="4" y="4" width="112" height="132" rx="14" fill="none" stroke="${C.lime}" stroke-opacity=".55" class="glow"/>` : ""}
      <g transform="translate(60 44)">
        <path d="M-18 -20 H18 V-6 A18 18 0 0 1 -18 -6 Z" fill="${cup}"/>
        <path d="M-18 -16 H-26 A8 8 0 0 0 -18 -2 M18 -16 H26 A8 8 0 0 1 18 -2" fill="none" stroke="${cup}" stroke-width="3"/>
        <rect x="-3" y="11" width="6" height="8" fill="${cup}"/>
        <rect x="-12" y="19" width="24" height="5" rx="2" fill="${cup}"/>
        <text y="-4" text-anchor="middle" style="font:800 ${rank.length > 2 ? 10 : 13}px ${FONT};fill:${C.bg}">${rank}</text>
      </g>
      <text x="60" y="95" text-anchor="middle" style="font:700 13px ${FONT};fill:${C.text}">${esc(t.title)}</text>
      <text x="60" y="116" text-anchor="middle" style="font:600 12px ${FONT};fill:${C.lime}">${esc(fmt(t.value))}${t.unit ? " " + t.unit : ""}</text>
    </g>
  </g>`;
}

function trophiesSvg(u) {
  const cc = u.contributionsCollection;
  const stars = u.repositories.nodes.reduce((s, r) => s + r.stargazerCount, 0);
  const years = Math.max(1, Math.floor((Date.now() - Date.parse(u.createdAt)) / (365.25 * 864e5)));
  const trophies = [
    { title: "Contributions", value: cc.contributionCalendar.totalContributions, steps: [1, 50, 200, 500, 1000, 2000, 4000, 8000] },
    { title: "Commits", value: cc.totalCommitContributions + cc.restrictedContributionsCount, steps: [1, 20, 100, 250, 500, 1000, 2000, 4000] },
    { title: "Repositories", value: u.repositories.totalCount, steps: [1, 5, 10, 20, 35, 50, 80, 120] },
    { title: "Pull Requests", value: u.pullRequests.totalCount, steps: [1, 5, 15, 30, 60, 100, 200, 500] },
    { title: "Followers", value: u.followers.totalCount, steps: [1, 5, 15, 30, 60, 100, 200, 500] },
    { title: "Stars", value: stars, steps: [1, 5, 15, 30, 60, 100, 200, 500] },
    { title: "Experience", value: years, unit: years === 1 ? "yr" : "yrs", steps: [1, 2, 3, 4, 5, 7, 10, 15] },
  ];
  const w = trophies.length * 120;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="160" viewBox="0 0 ${w} 160" role="img" aria-label="GitHub trophies for ${esc(USER)}">
  <style>
    .pop { transform-box: fill-box; transform-origin: center; animation: pop .7s cubic-bezier(.16,1,.3,1) backwards; }
    .glow { animation: glow 2.4s ease-in-out infinite; }
    @keyframes pop { from { transform: translateY(14px) scale(.94); } to { transform: none; } }
    @keyframes glow { 50% { stroke-opacity: .1; } }
  </style>
  ${trophies.map(trophyCard).join("")}
</svg>`;
}

// ---------------------------------------------------------------- activity graph
function activitySvg(u) {
  const days = u.contributionsCollection.contributionCalendar.weeks.flatMap((w) => w.contributionDays).slice(-31);
  const W = 1000, H = 320, L = 60, R = 30, T = 70, B = 50;
  const max = Math.max(4, ...days.map((d) => d.contributionCount));
  const niceMax = Math.ceil(max / 4) * 4;
  const x = (i) => L + (i * (W - L - R)) / (days.length - 1);
  const y = (v) => T + (H - T - B) * (1 - v / niceMax);
  const pts = days.map((d, i) => [x(i), y(d.contributionCount)]);

  // smooth curve (Catmull-Rom → cubic Bézier)
  let line = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    line += ` C${c1[0].toFixed(1)},${Math.min(c1[1], H - B).toFixed(1)} ${c2[0].toFixed(1)},${Math.min(c2[1], H - B).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  const area = `${line} L${x(days.length - 1)},${H - B} L${L},${H - B} Z`;
  const total = days.reduce((s, d) => s + d.contributionCount, 0);

  const grid = [0, 1, 2, 3, 4].map((k) => {
    const v = (niceMax / 4) * k, yy = y(v);
    return `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" stroke="${C.border}" stroke-dasharray="${k ? "4 6" : "0"}"/>
    <text x="${L - 12}" y="${yy + 4}" text-anchor="end" style="font:500 12px ${FONT};fill:${C.muted}">${v}</text>`;
  }).join("");
  const xLabels = days.map((d, i) => (i % 5 === 0 || i === days.length - 1)
    ? `<text x="${x(i)}" y="${H - B + 22}" text-anchor="middle" style="font:500 12px ${FONT};fill:${C.muted}">${d.date.slice(8)}/${d.date.slice(5, 7)}</text>` : "").join("");
  const dots = pts.map(([px, py], i) =>
    `<circle cx="${px}" cy="${py}" r="3.5" fill="${C.text}" stroke="${C.lime}" stroke-width="2" class="dot" style="animation-delay:${(i * 0.08).toFixed(2)}s"/>`).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Contributions in the last 31 days">
  <defs>
    <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="${C.lime}" stop-opacity=".35"/>
      <stop offset="1" stop-color="${C.lime}" stop-opacity="0"/>
    </linearGradient>
    <style>
      .pulse { stroke-dasharray: 90 3000; animation: run 3.2s linear infinite; }
      .area  { animation: breathe 4s ease-in-out infinite; }
      .dot   { animation: blink 2.4s ease-in-out infinite; }
      @keyframes run { from { stroke-dashoffset: 90; } to { stroke-dashoffset: -3000; } }
      @keyframes breathe { 50% { opacity: .6; } }
      @keyframes blink { 50% { opacity: .45; } }
    </style>
  </defs>
  <rect width="${W}" height="${H}" rx="16" fill="${C.bg}"/>
  <text x="${L}" y="38" style="font:700 20px ${FONT};fill:${C.lime}">Contribution Activity</text>
  <text x="${W - R}" y="38" text-anchor="end" style="font:600 14px ${FONT};fill:${C.muted}">${total} contributions · last 31 days</text>
  ${grid}
  <path d="${area}" fill="url(#area)" class="area"/>
  <path d="${line}" fill="none" stroke="${C.lime}" stroke-width="3" stroke-linecap="round"/>
  <path d="${line}" fill="none" stroke="#FFFFFF" stroke-opacity=".85" stroke-width="4" stroke-linecap="round" class="pulse"/>
  ${dots}
  ${xLabels}
</svg>`;
}

const user = await fetchUser();
await mkdir(OUT, { recursive: true });
await writeFile(`${OUT}/trophies.svg`, trophiesSvg(user));
await writeFile(`${OUT}/activity-graph.svg`, activitySvg(user));
console.log(`Wrote ${OUT}/trophies.svg and ${OUT}/activity-graph.svg`);
