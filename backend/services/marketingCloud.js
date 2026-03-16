// services/marketingCloud.js
const axios = require('axios');

/* ─────────────────────────────────────────────────
   NOTE: env vars are read INSIDE each function
   so that dotenv.config() in server.js has already
   run before these values are accessed.
   Reading them at module-load time (top-level const)
   causes them to be undefined — that is why
   console.log showed nothing and tokens were null.
───────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────
   1.  Get Marketing Cloud access token
───────────────────────────────────────────────── */
async function getMCToken() {
  const MC_SUBDOMAIN = process.env.MC_SUBDOMAIN;
  const MC_CLIENT_ID = process.env.MC_CLIENT_ID;
  const MC_SECRET    = process.env.MC_CLIENT_SECRET;
  const MC_MID       = process.env.MC_MID;

  if (!MC_SUBDOMAIN || !MC_CLIENT_ID || !MC_SECRET || !MC_MID) {
    throw new Error('Marketing Cloud env vars missing (MC_SUBDOMAIN / MC_CLIENT_ID / MC_CLIENT_SECRET / MC_MID)');
  }

  const res = await axios.post(
    `https://${MC_SUBDOMAIN}.auth.marketingcloudapis.com/v2/token`,
    {
      grant_type   : 'client_credentials',
      client_id    : MC_CLIENT_ID,
      client_secret: MC_SECRET,
      account_id   : MC_MID
    },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const token = res.data?.access_token;
  if (!token) throw new Error('MC auth: no access_token in response');
  console.log('[MC] Token obtained');
  return token;
}

/* ─────────────────────────────────────────────────
   2.  Fire Journey Builder entry event
       contactKey = SF Contact Id
───────────────────────────────────────────────── */
async function fireJourneyEvent(token, contactKey, payload) {
  const MC_SUBDOMAIN = process.env.MC_SUBDOMAIN;

  if (!MC_SUBDOMAIN) {
    throw new Error('Marketing Cloud env vars missing (MC_SUBDOMAIN / MC_EVENT_DEF_KEY)');
  }

  const leadPayload = {
     contactKey  : contactKey,
     firstName   : payload.firstName,
     lastName    : payload.lastName,
     email       : payload.email,
     mobile      : payload.mobile,
     state       : payload.state,
     city        : payload.city,
     category    : payload.category,
     subject     : payload.subject,
     productType : payload.productType,
     description : payload.description,
     leadStatus  : 'New'
  };

  const casePayload = {
     contactKey  : contactKey,
     firstName   : payload.firstName,
     lastName    : payload.lastName,
     email       : payload.email,
     mobile      : payload.mobile,
     state       : payload.state,
     city        : payload.city,
     category    : payload.category,
     subject     : payload.subject,
     productType : payload.productType,
     description : payload.description,
     caseTokenId : payload.caseId,
     CaseOrigin  : 'Website'
  };

  const isPurchase = payload.category?.trim().toLowerCase() === 'purchase';
  const payloadToSend = isPurchase ? leadPayload : casePayload;  

  try {
    const res = await axios.post(
      `https://${MC_SUBDOMAIN}.rest.marketingcloudapis.com/interaction/v1/events`,
      {
        ContactKey        : contactKey,
        EventDefinitionKey: isPurchase ? process.env.MC_EVENT_DEF_LEAD_KEY : process.env.MC_EVENT_DEF_CASE_KEY,
        Data: payloadToSend
      },
      {
        headers: {
          Authorization : `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // MC returns 201 on success; axios throws on 4xx/5xx automatically
    console.log('[MC] Journey event fired, status:', isPurchase ? 'Lead' : 'Case', res.status);
    return res.data;
  } catch (err) {
    console.error('[MC] Journey event error:', err.response?.data || err.message);
    throw new Error('Failed to fire Marketing Cloud journey event.');
  }
}

module.exports = { getMCToken, fireJourneyEvent };
