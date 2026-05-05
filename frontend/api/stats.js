// GET /api/stats?source=all&range=daily|weekly|biweekly|monthly
// ONLY returns leads whose created_at falls within the selected date range
const { supabase, setCors, TRACKED_STAGES, SOURCES } = require("./_lib");

function getDateRange(range) {
  const now = new Date();
  const start = new Date();
  switch (range) {
    case "daily":
      start.setHours(0, 0, 0, 0);
      break;
    case "weekly":
      const diff = now.getDay() === 0 ? 6 : now.getDay() - 1;
      start.setDate(now.getDate() - diff);
      start.setHours(0, 0, 0, 0);
      break;
    case "biweekly":
      start.setDate(now.getDate() - 13);
      start.setHours(0, 0, 0, 0);
      break;
    case "monthly":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      return null;
  }
  return start.toISOString();
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
