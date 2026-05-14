const express = require('express');
const twilio = require('twilio');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors());

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'AC716cc3da6e7af65f21d0441e8861e4a0';
const AUTH_TOKEN  = process.env.TWILIO_AUTH_TOKEN  || '93f9995e5184ac83be04b50f80b4c775';
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || '+18559750854';
const ALERT_TO    = process.env.ALERT_PHONE        || '+12039487692';

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

app.post('/send-sms', async (req, res) => {
  try {
    const { body } = req.body;
    if (!body) return res.status(400).json({ ok: false, error: 'No message body provided.' });

    const message = await client.messages.create({
      body,
      from: 'whatsapp:+14155238886',      
      to: 'whatsapp:' + ALERT_TO,    });

    console.log(`[${new Date().toISOString()}] SMS sent — SID: ${message.sid}`);
    res.json({ ok: true, sid: message.sid });
  } catch (err) {
    console.error('Twilio error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/health', (_, res) => res.json({ ok: true, service: 'Elite Receiving SMS', ts: new Date().toISOString() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Elite SMS backend running on port ${PORT}`));
