// GET /api/health
const { supabase, setCors } = require("./_lib");

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    const leads = await supabase("/leads?select=count", { method: "GET", prefer: "count=exact", headers: { "Prefer": "count=exact" } });
    return res.json({ status: "ok", supabase: "connected" });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
}
