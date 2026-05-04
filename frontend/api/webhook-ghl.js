// POST /api/webhook-ghl
// Accepts GHL webhook in ANY format - very permissive field extraction
const { supabase, normalizeSource, setCors, TRACKED_STAGES } = require("./_lib");

function extract(body) {
  // GHL sends data in many different shapes depending on version + trigger type
  // This tries every known field path

  const contactId =
    body.contact_id      ||
    body.contactId       ||
    body.id              ||
    body.contact?.id     ||
    body.payload?.contact_id ||
    body.payload?.id     ||
    null;

  const contactName =
    body.full_name              ||
    body.name                   ||
    body.contact_name           ||
    body.contactName            ||
    body.contact?.full_name     ||
    body.contact?.name          ||
    body.payload?.full_name     ||
    body.payload?.name          ||
    `${body.first_name || body.contact?.first_name || ''} ${body.last_name || body.contact?.last_name || ''}`.trim() ||
    'Unknown';

  const stage =
    body.pipeline_stage_name     ||
    body.pipelineStageName       ||
    body.stage_name              ||
    body.stageName               ||
    body.stage?.name             ||
    body.opportunity?.pipeline_stage_name ||
    body.opportunity?.stageName  ||
    body.payload?.pipeline_stage_name ||
    body.pipeline_stage          ||
    null;

  const rawSource =
    body.lead_source             ||
    body.leadSource              ||
    body.source                  ||
    body.contact?.source         ||
    body.contact?.lead_source    ||
    body.payload?.lead_source    ||
    body.customField?.lead_source ||
    body.custom_fields?.lead_source ||
    null;

  const email =
    body.email           ||
    body.contact?.email  ||
    body.payload?.email  ||
    '';

  const phone =
    body.phone           ||
    body.contact?.phone  ||
    body.payload?.phone  ||
    '';

  return { contactId, contactName, stage, rawSource, email, phone };
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body;

    // Log raw payload to help debug (visible in Vercel function logs)
    console.log("GHL WEBHOOK RECEIVED:", JSON.stringify(body, null, 2));

    const { contactId, contactName, stage, rawSource, email, phone } = extract(body);
    const source = normalizeSource(rawSource);
    const timestamp = new Date().toISOString();

    // If we still can't find contactId or stage, return 200 anyway
    // (so GHL doesn't keep retrying) but log what we got
    if (!contactId) {
      console.warn("Could not extract contactId from payload:", JSON.stringify(body));
      return res.status(200).json({ 
        success: false, 
        warning: "Could not extract contactId",
        received: Object.keys(body),
      });
    }

    if (!stage) {
      console.warn("Could not extract stage from payload:", JSON.stringify(body));
      return res.status(200).json({ 
        success: false,
        warning: "Could not extract stage",
        contactId,
        received_keys: Object.keys(body),
      });
    }

    // Check if lead already exists
    let existing = null;
    try {
      const rows = await supabase(
        `/leads?contact_id=eq.${encodeURIComponent(contactId)}&limit=1`,
        { method: "GET", prefer: "" }
      );
      existing = rows && rows.length > 0 ? rows[0] : null;
    } catch (e) {
      console.error("Supabase lookup error:", e.message);
    }

    if (existing) {
      const stageHistory = [...(existing.stage_history || []), { stage, timestamp }];
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
      await supabase("/leads", {
        method: "POST",
        body: JSON.stringify({
          contact_id:    contactId,
          name:          contactName || 'Unknown',
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

    console.log(`✓ Saved: ${contactName} → ${stage} (${source})`);
    return res.status(200).json({ success: true, contactId, stage, source });

  } catch (err) {
    console.error("Webhook error:", err);
    // Return 200 so GHL doesn't keep retrying — log the real error
    return res.status(200).json({ success: false, error: err.message });
  }
}
