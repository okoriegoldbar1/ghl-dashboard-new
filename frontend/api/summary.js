// GET /api/summary
const { supabase, setCors, TRACKED_STAGES } = require("./_lib");

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const today = new Date().toISOString().split("T")[0];
    const allLeads = await supabase("/leads?order=updated_at.desc&limit=1000", { method: "GET", prefer: "" }) || [];

    const todayLeads = allLeads.filter(l => l.created_at && l.created_at.startsWith(today));

    const stageCounts = {};
    TRACKED_STAGES.forEach(s => {
      stageCounts[s] = allLeads.filter(l => l.current_stage === s).length;
    });

    const sourceTotalsToday = {};
    todayLeads.forEach(l => {
      sourceTotalsToday[l.source] = (sourceTotalsToday[l.source] || 0) + 1;
    });

    const topSource = Object.entries(sourceTotalsToday).sort((a, b) => b[1] - a[1])[0];

    return res.json({
      date: today,
      todayCount: todayLeads.length,
      topSource: topSource ? { name: topSource[0], count: topSource[1] } : null,
      stageCounts,
      totalLeads: allLeads.length,
    });
  } catch (err) {
    console.error("Summary error:", err);
    return res.status(500).json({ error: err.message });
  }
}
