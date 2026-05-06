// GET /api/stats?source=all&range=daily|weekly|biweekly|monthly
// ONLY returns leads whose created_at falls within the selected date range
const { supabase, setCors, TRACKED_STAGES, SOURCES } = require("./_lib");

const TZ = "America/New_York"; // EST/EDT

function getNowEST() {
  // Get current date/time components in EST
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(formatter.formatToParts(new Date()).map(p => [p.type, p.value]));
  return new Date(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`);
}

function getStartOfDayEST(date) {
  // Get midnight EST as a UTC ISO string
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map(p => [p.type, p.value]));
  // midnight EST = 5am UTC (or 4am during DST)
  const midnightEST = new Date(`${parts.year}-${parts.month}-${parts.day}T00:00:00`);
  // Convert to UTC by finding the offset
  const offset = date.getTime() - getNowEST().getTime();
  return new Date(midnightEST.getTime() - offset);
}

function getDateRange(range) {
  const now = new Date();
  const nowEST = getNowEST();

  switch (range) {
    case "daily": {
      return getStartOfDayEST(now).toISOString();
    }
    case "weekly": {
      const day = nowEST.getDay(); // 0=Sun
      const diff = day === 0 ? 6 : day - 1; // Monday start
      const monday = new Date(now);
      monday.setDate(monday.getDate() - diff);
      return getStartOfDayEST(monday).toISOString();
    }
    case "biweekly": {
      const d = new Date(now);
      d.setDate(d.getDate() - 13);
      return getStartOfDayEST(d).toISOString();
    }
    case "monthly": {
      const d = new Date(now);
      d.setDate(1);
      return getStartOfDayEST(d).toISOString();
    }
    default:
      return null;
  }
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const source = req.query.source || "all";
    const range  = req.query.range  || "all";
    const fromDate = getDateRange(range);

    let path = "/leads?order=created_at.desc&limit=1000";
    if (fromDate) {
      path += `&created_at=gte.${encodeURIComponent(fromDate)}`;
    }

    const allInRange = await supabase(path, { method: "GET", prefer: "" }) || [];
    const filtered = source !== "all" ? allInRange.filter(l => l.source === source) : allInRange;

    const stageCounts = {};
    TRACKED_STAGES.forEach(s => {
      stageCounts[s] = { total: 0 };
      SOURCES.forEach(src => { stageCounts[s][src] = 0; });
    });

    filtered.forEach(lead => {
      const stage = lead.current_stage;
      // Try exact match first, then case-insensitive
      const matchedStage = stageCounts[stage]
        ? stage
        : TRACKED_STAGES.find(s => s.toLowerCase() === (stage || '').toLowerCase());
      if (matchedStage && stageCounts[matchedStage]) {
        stageCounts[matchedStage].total++;
        if (stageCounts[matchedStage][lead.source] !== undefined) {
          stageCounts[matchedStage][lead.source]++;
        }
      }
    });

    const sourceTotals = {};
    SOURCES.forEach(src => {
      sourceTotals[src] = allInRange.filter(l => l.source === src).length;
    });

    const recentLeads = filtered.map(l => ({
      contactId: l.contact_id, name: l.name, source: l.source,
      currentStage: l.current_stage, updatedAt: l.updated_at, createdAt: l.created_at,
    }));

    return res.json({
      totalLeads: filtered.length, stageCounts, sourceTotals,
      recentLeads, lastUpdated: filtered[0]?.updated_at || null,
      stages: TRACKED_STAGES, sources: SOURCES, range, fromDate,
    });
  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({ error: err.message });
  }
}
