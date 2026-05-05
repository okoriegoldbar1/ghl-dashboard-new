const { supabase, normalizeSource, setCors } = require("./_lib");

function extract(body) {
  // Contact ID
  const contactId =
    body.customData?.contactId   ||
    body.contact_id              ||
    body.contactId               ||
    body.id                      ||
    null;

  // Name
  const contactName =
    body.customData?.full_name   ||
    body.full_name               ||
    body.name                    ||
    `${body.first_name || ''} ${body.last_name || ''}`.trim() ||
    'Unknown';

  // Stage — GHL has a TYPO: "pipleline_stage" (missing the e)
  const stage =
    body.customData?.pipeline_stage_name  ||
    body.pipleline_stage                  ||  // GHL's typo
    body.pipeline_stage_name              ||
    body.pipeline_stage                   ||
    body.stageName                        ||
    body.stage?.name                      ||
    null;

  // Source — prefer customData which you control
  const rawSource =
    body.customData?.lead_source  ||
    body.contact_source           ||
    body.opportunity_source       ||
    body.source                   ||
    null;

  // Pipeline name (for reference)
  const pipelineName =
    body.pipeline_name || null;

  const email = body.customData?.email || body.email || '';
  const phone = body.customData?.phone || body.phone || '';

  return { contactId, contactName, stage, rawSource, pipelineName, email, phone };
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body;
    const { contactId, contactName, stage, rawSource, pipelineName, email, phone } = extract(body);
    const source = normalizeSource(rawSource);
    const timestamp = new Date().toISOString();

    console.log(`Extracted → contactId: ${contactId}, stage: ${stage}, source: ${source}, pipeline: ${pipelineName}`);

    if (!contactId) {
      console.warn("Missing contactId");
      return res.status(200).json({ success: false, warning: "Missing contactId" });
    }

    if (!stage) {
      console.warn("Missing stage — keys received:", Object.keys(body));
      return res.status(200).json({ success: false, warning: "Missing stage", keys: Object.keys(body) });
    }

    // Check if lead exists
    const existing = await supabase(
      `/leads?contact_id=eq.${encodeURIComponent(contactId)}&limit=1`,
      { method: "GET", prefer: "" }
    ).catch(() => null);

    if (existing && existing.length > 0) {
      const stageHistory = [...(existing[0].stage_history || []), { stage, timestamp }];
      await supabase(`/leads?contact_id=eq.${encodeURIComponent(contactId)}`, {
        method: "PATCH",
        body: JSON.stringify({
          current_stage: stage,
          source,
          stage_history: stageHistory,
          updated_at: timestamp,
        }),
      });
      console.log(`✓ Updated: ${contactName} → ${stage}`);
    } else {
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
      console.log(`✓ Created: ${contactName} → ${stage}`);
    }

    return res.status(200).json({ success: true, contactId, stage, source });

  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(200).json({ success: false, error: err.message });
  }
}
