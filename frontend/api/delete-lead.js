// DELETE /api/delete-lead?contactId=xxx
const { supabase, setCors } = require("./_lib");

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

  const { contactId } = req.query;
  if (!contactId) return res.status(400).json({ error: "Missing contactId" });

  try {
    await supabase(
      `/leads?contact_id=eq.${encodeURIComponent(contactId)}`,
      { method: "DELETE", prefer: "return=minimal" }
    );
    return res.status(200).json({ success: true, deleted: contactId });
  } catch (err) {
    console.error("Delete error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
