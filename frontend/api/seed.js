// POST /api/seed  — populates demo data for testing
const { supabase, setCors } = require("./_lib");

const DEMO_LEADS = [
  { contact_id: "d1",  name: "Alex Rivera",    source: "Meta Ads",       current_stage: "Application Screening" },
  { contact_id: "d2",  name: "Jordan Lee",      source: "Meta Ads",       current_stage: "Qualified for Group Interview" },
  { contact_id: "d3",  name: "Sam Patel",       source: "Meta Ads",       current_stage: "Group Interview Booked" },
  { contact_id: "d4",  name: "Casey Nguyen",    source: "Meta Ads",       current_stage: "Approved for Academy" },
  { contact_id: "d5",  name: "Riley Kim",       source: "Meta Ads",       current_stage: "Website Live" },
  { contact_id: "d6",  name: "Morgan Chen",     source: "Indeed",         current_stage: "Application Screening" },
  { contact_id: "d7",  name: "Taylor Brooks",   source: "Indeed",         current_stage: "Qualified for Group Interview" },
  { contact_id: "d8",  name: "Drew Santos",     source: "Indeed",         current_stage: "Group Interview Booked" },
  { contact_id: "d9",  name: "Quinn Adams",     source: "Indeed",         current_stage: "Approved for Academy" },
  { contact_id: "d10", name: "Avery Gomez",     source: "OnlineJobs.ph",  current_stage: "Application Screening" },
  { contact_id: "d11", name: "Blake Torres",    source: "OnlineJobs.ph",  current_stage: "Qualified for Group Interview" },
  { contact_id: "d12", name: "Charlie Reyes",   source: "OnlineJobs.ph",  current_stage: "Website Live" },
];

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const now = new Date().toISOString();
    const rows = DEMO_LEADS.map(d => ({
      ...d,
      email: "", phone: "",
      stage_history: [],
      created_at: now,
      updated_at: now,
    }));

    await supabase("/leads", {
      method: "POST",
      body: JSON.stringify(rows),
      prefer: "return=minimal",
    });

    return res.json({ success: true, seeded: rows.length });
  } catch (err) {
    console.error("Seed error:", err);
    return res.status(500).json({ error: err.message });
  }
}
