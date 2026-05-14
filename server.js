const express = require('express');
const twilio = require('twilio');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'AC716cc3da6e7af65f21d0441e8861e4a0';
const AUTH_TOKEN  = process.env.TWILIO_AUTH_TOKEN  || 'b904beedbdb6e852d1625440c72b2e9f';
const ALERT_TO    = process.env.ALERT_PHONE        || '+12039487692';

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

let entries = [];

app.get('/entries', (req, res) => {
  res.json({ ok: true, entries });
});

app.post('/entries', async (req, res) => {
  try {
    const entry = { ...req.body, id: Date.now(), ts: new Date().toISOString(), status: 'pending' };
    entries.unshift(entry);

    const t = new Date(entry.ts).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    let lines = ['📦 ELITE RECEIVING ALERT', 'Material: ' + entry.material, 'Vendor: ' + entry.vendor, 'Qty: ' + entry.qty + ' ' + entry.unit + ' · Condition: ' + entry.condition, 'Received by: ' + entry.receiver];
    if (entry.po) lines.push('PO: ' + entry.po);
    lines.push('Time: ' + t);
    if (entry.notes) lines.push('Notes: ' + entry.notes);
    lines.push('→ Review at elite-containers.app');
    const msgBody = lines.join('\n');

    let smsSid = null;
    try {
      const msg = await client.messages.create({ body: msgBody, from: 'whatsapp:+14155238886', to: 'whatsapp:' + ALERT_TO });
      smsSid = msg.sid;
      console.log(`[${new Date().toISOString()}] WhatsApp sent — SID: ${smsSid}`);
    } catch (e) {
      console.error('WhatsApp error:', e.message);
    }

    res.json({ ok: true, entry, smsSid });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.patch('/entries/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const entry = entries.find(e => e.id === id);
  if (!entry) return res.status(404).json({ ok: false, error: 'Not found' });
  Object.assign(entry, req.body);
  res.json({ ok: true, entry });
});

app.get('/health', (_, res) => res.json({ ok: true, service: 'Elite Receiving SMS', ts: new Date().toISOString() }));

app.get('/test-whatsapp', async (req, res) => {
  try {
    const body = `📦 ELITE RECEIVING — TEST ALERT\nThis is a test from your receiving log system.\nIf you see this on WhatsApp, everything is working!\nTime: ${new Date().toLocaleString('en-US')}`;
    const message = await client.messages.create({ body, from: 'whatsapp:+14155238886', to: 'whatsapp:' + ALERT_TO });
    console.log(`[${new Date().toISOString()}] Test WhatsApp sent — SID: ${message.sid}`);
    res.json({ ok: true, message: 'Test WhatsApp sent to ' + ALERT_TO, sid: message.sid });
  } catch (err) {
    console.error('Twilio WhatsApp error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Elite SMS backend running on port ${PORT}`));
