// Shared helpers for all Vercel serverless functions
// Uses the Supabase REST API directly (no npm package needed in serverless)

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars");
}

// ── Generic Supabase REST fetch ───────────────────────────────────────────────
async function supabase(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "return=representation",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error (${res.status}): ${err}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ── Source normalisation ──────────────────────────────────────────────────────
const SOURCE_MAP = {
  facebook: "Meta Ads", fb: "Meta Ads", meta: "Meta Ads", instagram: "Meta Ads",
  indeed: "Indeed",
  onlinejobs: "OnlineJobs.ph", "onlinejobs.ph": "OnlineJobs.ph", ojph: "OnlineJobs.ph",
};

function normalizeSource(raw) {
  if (!raw) return "Unknown";
  const lower = raw.toLowerCase().trim();
  for (const [key, val] of Object.entries(SOURCE_MAP)) {
    if (lower.includes(key)) return val;
  }
  return raw;
}

// ── CORS helper ───────────────────────────────────────────────────────────────
function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ── Tracked stages & sources ──────────────────────────────────────────────────
const TRACKED_STAGES = [
  "Application Screening",
  "Qualified for Group Interview",
  "Group Interview Booked",
  "Approved for Academy",
  "Website Live",
];

const SOURCES = ["Meta Ads", "Indeed", "OnlineJobs.ph"];

module.exports = { supabase, normalizeSource, setCors, TRACKED_STAGES, SOURCES };
