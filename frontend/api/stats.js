// GET /api/stats?source=all|Meta Ads|Indeed|OnlineJobs.ph
const { supabase, setCors, TRACKED_STAGES, SOURCES } = require("./_lib");

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const source = req.query.source;

    // Fetch all leads from Supabase
    let path = "/leads?order=updated_at.desc&limit=1000";
    const allLeads = await supabase(path, { method: "GET", prefer: "" }) || [];

    // Filter by source if requested
    const filtered = source && source !== "all"
      ? allLeads.filter(l => l.source === source)
      : allLeads;

    // Build stage counts
    const stageCounts = {};
    TRACKED_STAGES.forEach(s => {
      stageCounts[s] = { total: 0 };
      SOURCES.forEach(src => { stageCounts[s][src] = 0; });
    });

    filtered.forEach(lead => {
      const stage = lead.current_stage;
      if (stageCounts[stage]) {
        stageCounts[stage].total++;
        if (stageCounts[stage][lead.source] !== undefined) {
          stageCounts[stage][lead.source]++;
        }
      }
    });

    // Source totals (always from ALL leads, not filtered)
    const sourceTotals = {};
    SOURCES.forEach(src => {
      sourceTotals[src] = allLeads.filter(l => l.source === src).length;
    });

    // Recent leads (top 20, most recently updated)
    const recentLeads = filtered.slice(0, 20).map(l => ({
      contactId:    l.contact_id,
      name:         l.name,
      source:       l.source,
      currentStage: l.current_stage,
      updatedAt:    l.updated_at,
      createdAt:    l.created_at,
    }));

    const lastUpdated = allLeads.length > 0 ? allLeads[0].updated_at : null;

    return res.json({
      totalLeads: filtered.length,
      stageCounts,
      sourceTotals,
      recentLeads,
      lastUpdated,
      stages: TRACKED_STAGES,
      sources: SOURCES,
    });
  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({ error: err.message });
  }
}
