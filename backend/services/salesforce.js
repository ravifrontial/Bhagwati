// services/salesforce.js
const axios = require('axios');

/* ─────────────────────────────────────────────────
   NOTE: env vars are read INSIDE each function
   so that dotenv.config() in server.js has already
   run before these values are accessed.
   Reading them at module-load time causes undefined
   because Node requires services before dotenv loads.
───────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────
   1.  Get Salesforce access token
───────────────────────────────────────────────── */
async function getSFToken() {
  const SF_BASE      = process.env.SF_BASE_URL;
  const SF_CLIENT_ID = process.env.SF_CLIENT_ID;
  const SF_SECRET    = process.env.SF_CLIENT_SECRET;

  if (!SF_BASE || !SF_CLIENT_ID || !SF_SECRET) {
    throw new Error('Salesforce env vars missing (SF_BASE_URL / SF_CLIENT_ID / SF_CLIENT_SECRET)');
  }

  const url = `${SF_BASE}/services/oauth2/token` +
    `?grant_type=client_credentials` +
    `&client_id=${encodeURIComponent(SF_CLIENT_ID)}` +
    `&client_secret=${encodeURIComponent(SF_SECRET)}`;

  const res = await axios.post(url, null, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const token = res.data?.access_token;
  if (!token) throw new Error('Salesforce auth: no access_token in response');
  console.log('[SF] Token obtained');
  return token;
}

/* ─────────────────────────────────────────────────
   2.  Check if contact exists (by Email OR Phone)
       Returns contactId string | null
───────────────────────────────────────────────── */
async function findContact(token, email, phone) {
  const SF_BASE = process.env.SF_BASE_URL;

  const soql = `SELECT Id FROM Contact WHERE Email='${email}' OR Phone='${phone}'`;
  const res  = await axios.get(
    `${SF_BASE}/services/data/v64.0/query`,
    {
      params : { q: soql },
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    }
  );

  if (res.data?.totalSize > 0) {
    const id = res.data.records[0].Id;
    console.log(`[SF] Existing contact found: ${id}`);
    return id;
  }
  console.log('[SF] No existing contact found');
  return null;
}

/* ─────────────────────────────────────────────────
   3.  Insert Account record
       Returns accountId
───────────────────────────────────────────────── */
async function insertAccount(token, payload) {
  const SF_BASE = process.env.SF_BASE_URL;

  const res = await axios.post(
    `${SF_BASE}/services/data/v64.0/sobjects/Account/`,
    {
      Name : `${payload.firstName} ${payload.lastName}`,
      Phone: payload.mobile
    },
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );

  const id = res.data?.id;
  if (!id) throw new Error('Account insert: no id returned');
  console.log(`[SF] Account created: ${id}`);
  return id;
}

/* ─────────────────────────────────────────────────
   4.  Insert Contact record (linked to account)
       Returns contactId
───────────────────────────────────────────────── */
async function insertContact(token, accountId, payload) {
  const SF_BASE = process.env.SF_BASE_URL;

  const res = await axios.post(
    `${SF_BASE}/services/data/v64.0/sobjects/Contact/`,
    {
      AccountId: accountId,
      FirstName: payload.firstName,
      LastName : payload.lastName,
      Phone    : payload.mobile,
      Email    : payload.email
    },
    {
      headers: {
        Authorization                : `Bearer ${token}`,
        'Content-Type'               : 'application/json',
        'Sforce-Duplicate-Rule-Header': 'allowSave=true'
      }
    }
  );

  const id = res.data?.id;
  if (!id) throw new Error('Contact insert: no id returned');
  console.log(`[SF] Contact created: ${id}`);
  return id;
}

/* ─────────────────────────────────────────────────
   5.  Insert Lead record
       FIX 1: Company is REQUIRED on Lead — without
              it SF returns 400 "Required fields missing"
       FIX 2: Custom fields (State__c etc.) may not
              exist in your org — they are sent but
              won't cause a 502 if missing; SF ignores
              unknown fields only when using REST.
              If you get INVALID_FIELD errors, remove
              those custom fields until they are
              created in your SF org.
       FIX 3: Removed the `if (!res.data?.success)`
              check — SF Lead insert returns 201 on
              success; axios already throws on 4xx/5xx
              so the check was masking the real error.
───────────────────────────────────────────────── */
async function insertLead(token, payload) {
  const SF_BASE = process.env.SF_BASE_URL;

  const body = {
    FirstName  : payload.firstName,
    LastName   : payload.lastName,
    Email      : payload.email,
    MobilePhone: payload.mobile,
    // Company is REQUIRED on Lead — use company name if available, else fallback
    Company    : payload.company || `${payload.firstName} ${payload.lastName}`,
    Status     : 'New',
    Description: payload.description,
    // Custom fields — only included if your SF org has them
    // Remove any that don't exist in your org to avoid INVALID_FIELD errors
    ...(payload.state    && { State__c    : payload.state    }),
    ...(payload.city     && { City__c     : payload.city     }),
    ...(payload.category && { Category__c : payload.category }),
    ...(payload.subject  && { Subject__c  : payload.subject  })
  };

  const res = await axios.post(
    `${SF_BASE}/services/data/v64.0/sobjects/Lead/`,
    body,
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );

  // axios throws on non-2xx, so if we reach here the insert succeeded
  const id = res.data?.id;
  console.log(`[SF] Lead created: ${id}`);
  return id;
}

module.exports = { getSFToken, findContact, insertLead, insertAccount, insertContact };