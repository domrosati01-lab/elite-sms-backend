# Elite Containers — SMS Alert Backend

Sends a text to Dom's phone every time a delivery is logged.

## Deploy to Railway (free, 5 minutes)

1. Go to railway.app and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
   - OR click "New Project" → "Empty project" → "Add Service" → "GitHub Repo"
3. Upload this folder, or paste the two files (server.js + package.json)
4. Railway auto-detects Node.js and runs `npm start`
5. Copy the public URL Railway gives you (e.g. https://elite-sms-xxx.up.railway.app)
6. Paste that URL into the receiving log app's SMS settings

## Environment Variables (set in Railway dashboard)
These are already hardcoded as defaults but can be overridden:

TWILIO_ACCOUNT_SID  = AC716cc3da6e7af65f21d0441e8861e4a0
TWILIO_AUTH_TOKEN   = 93f9995e5184ac83be04b50f80b4c775
TWILIO_FROM_NUMBER  = +18559750854
ALERT_PHONE         = +12039487692

## Test it
curl -X POST https://YOUR-URL/send-sms \
  -H "Content-Type: application/json" \
  -d '{"body":"Test from Elite Receiving"}'

## Important — Twilio Trial Account
Your Twilio trial account can only send texts to VERIFIED numbers.
Go to: console.twilio.com → Verified Caller IDs → add +12039487692
Once verified, texts will arrive instantly.
