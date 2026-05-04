// POST /api/debug
// Paste this URL into GHL webhook instead of /api/webhook-ghl
// It accepts anything and logs + returns exactly what GHL sends
// Use this to see the real field names GHL uses
const { setCors } = require("./_lib");

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const payload = {
    method: req.method,
    headers: req.headers,
    body: req.body,
    receivedAt: new Date().toISOString(),
  };

  console.log("DEBUG WEBHOOK:", JSON.stringify(payload, null, 2));

  // Return everything back so you can see it in GHL's webhook response panel
  return res.status(200).json({
    message: "Debug endpoint - here is exactly what GHL sent",
    ...payload,
  });
}
