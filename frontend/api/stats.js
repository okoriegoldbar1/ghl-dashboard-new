// GET /api/stats?source=all&range=daily|weekly|biweekly|monthly
const { supabase, setCors, TRACKED_STAGES, SOURCES } = require("./_lib");

const TZ = "America/New_York";

// Get today's date string in EST e.g. "2026-05-06"
function getTodayEST() {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

// Get a date N days ago as EST date string
function daysAgoEST(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString("en-CA", { timeZone: TZ });
}

// Get first day of current month in EST
function firstOfMonthEST() {
  const now = new Date();
  const estStr = now.toLocaleDateString("en-CA", { timeZone: TZ }); // "2026-05-06"
  return estStr.slice(0, 7) + "-01"; // "2026-05-01"
}

// Get Monday of current week in EST
function mondayOfWeekEST() {
  const now = new Date();
  const estStr = now.toLocaleDateString("en-CA", { timeZone: TZ });
  const estDate = new Date(estStr + "T00:00:00");
  const day = estDate.getDay(); // 0=Sun
  const diff = day === 0 ? 6 : day - 1;
  estDate.setDate(estDate.getDate() - diff);
  return estDate.toLocaleDateString("en-CA");
}

function getFromDate(range) {
  switch (range) {
    case "daily":    return getTodayEST();
    case "weekly":   return mondayOfWeekEST();
    case "biweekly": return daysAgoEST(13);
    case "monthly":  return firstOfMonthEST();
    default:         return null; // all time
  }
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const source = req.query.source || "all";
    const range  = req.query.range  || "all";
    const fromDate = getFromDate(range); // EST date string like "2026-05-01"

    // Build query - filter by created_at date string prefix
    let path = "/leads?order=created_at.desc&limit=2000";
    if (fromDate) {
      // Use gte on the ISO timestamp - leads created from start of fromDate EST
      // We convert EST midnight to UTC by using the date string directly
      // Supabase stores UTC so we need midnight EST in UTC
      // EST is UTC-5 (or UTC-4 DST) - use a safe offset of UTC-5
      const fromUTC = new Date(fromDate + "T05:00:00.000Z"); // midnight EST = 5am UTC
      path += `&created_at=gte.${fromUTC.toISOString()}`;
    }

    const allInRange = await supabase(path, { method: "GET", prefer: "" }) || [];

    // Filter by source
    const filtered = source !== "all"
      ? allInRange.filter(l => l.source === source)
      : allInRange;

    // Stage counts
    const stageCounts = {};
    TRACKED_STAGES.forEach(s => {
      stageCounts[s] = { total: 0 };
      SOURCES.forEach(src => { stageCounts[s][src] = 0; });
    });

    filtered.forEach(lead => {
      const stage = lead.current_stage;
      const matchedStage = stageCounts[stage]
        ? stage
        : TRACKED_STAGES.find(s => s.toLowerCase() === (stage || "").toLowerCase());
      if (matchedStage && stageCounts[matchedStage]) {
        stageCounts[matchedStage].total++;
        if (stageCounts[matchedStage][lead.source] !== undefined) {
          stageCounts[matchedStage][lead.source]++;
        }
      }
    });

    // Source totals scoped to date range
    const sourceTotals = {};
    SOURCES.forEach(src => {
      sourceTotals[src] = allInRange.filter(l => l.source === src).length;
    });

    const recentLeads = filtered.map(l => ({
      contactId:    l.contact_id,
      name:         l.name,
      email:        l.email || "",
      phone:        l.phone || "",
      source:       l.source,
      currentStage: l.current_stage,
      updatedAt:    l.updated_at,
      createdAt:    l.created_at,
    }));

    return res.json({
      totalLeads:   filtered.length,
      stageCounts,
      sourceTotals,
      recentLeads,
      lastUpdated:  filtered[0]?.updated_at || null,
      stages:       TRACKED_STAGES,
      sources:      SOURCES,
      range,
      fromDate,
      debug: { todayEST: getTodayEST(), fromDate, totalRows: allInRange.length }
    });

  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({ error: err.message });
  }
}
