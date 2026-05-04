// POST /api/webhook-ghl
// Receives pipeline stage change events from GoHighLevel workflows
const { supabase, normalizeSource, setCors, TRACKED_STAGES } = require("./_lib");

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body;

    const contactId   = body.contact_id  || body.id           || body.contactId;
    const contactName = body.full_name   || body.name         || body.contact?.name || "Unknown";
    const stage       = body.pipeline_stage_name || body.stageName || body.stage?.name;
    const rawSource   = body.lead_source || body.source       || body.contact?.source || body.customField?.lead_source;
    const source      = normalizeSource(rawSource);
    const email       = body.email       || body.contact?.email || "";
    const phone       = body.phone       || body.contact?.phone || "";
    const timestamp   = new Date().toISOString();

    if (!contactId || !stage) {
      return res.status(400).json({ error: "Missing contactId or stage" });
    }

    // Check if lead already exists
    const existing = await supabase(
      `/leads?contact_id=eq.${encodeURIComponent(contactId)}&limit=1`,
      { method: "GET", prefer: "" }
    );

    if (existing && existing.length > 0) {
      // Update existing lead
      const prev = existing[0];
      const stageHistory = [...(prev.stage_history || []), { stage, timestamp }];

      await supabase(`/leads?contact_id=eq.${encodeURIComponent(contactId)}`, {
        method: "PATCH",
        body: JSON.stringify({
          current_stage: stage,
          source,
          stage_history: stageHistory,
          updated_at: timestamp,
        }),
      });
    } else {
      // Insert new lead
      await supabase("/leads", {
        method: "POST",
        body: JSON.stringify({
          contact_id:    contactId,
          name:          contactName,
          email,
          phone,
          source,
          current_stage: stage,
          stage_history: [{ stage, timestamp }],
          created_at:    timestamp,
          updated_at:    timestamp,
        }),
      });
    }

    return res.json({ success: true, contactId, stage, source });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: err.message });
  }
}
