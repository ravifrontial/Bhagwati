// services/salesforce.js
const axios = require('axios');

/* ─────────────────────────────────────────────────
   NOTE: env vars are read INSIDE each function
   so that dotenv.config() in server.js has already
   run before these values are accessed.
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

  const url =
    `${SF_BASE}/services/oauth2/token` +
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
  const res = await axios.get(
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
   5.  Insert Lead (category === 'purchase')
       - Signature: insertLead(token, payload)
         payload must have: firstName, lastName,
         email, mobile, and optionally state, city,
         category, subject, description, company
       - FIX: removed the unused `contactKey` second
         param that was shadowing `payload` and causing
         firstName / lastName to read as undefined
───────────────────────────────────────────────── */
async function insertLead(token, payload) {
  const SF_BASE = process.env.SF_BASE_URL;

  // Guard: catch missing required fields early so the
  // error message is clear instead of an SF 400
  if (!payload.firstName || !payload.lastName) {
    throw new Error(
      `insertLead: firstName or lastName is missing. ` +
      `Received payload: ${JSON.stringify(payload)}`
    );
  }

  const body = {
    FirstName  : payload.firstName,
    LastName   : payload.lastName,
    Email      : payload.email,
    MobilePhone: payload.mobile,
    // Company is REQUIRED on Lead
    Company    : payload.company || `${payload.firstName} ${payload.lastName}`,
    Status     : 'New',
    Description: payload.description,
    LeadSource : 'Website',
    // Custom fields — only sent if values exist
    ...(payload.state    && { State__c    : payload.state    }),
    ...(payload.city     && { City__c     : payload.city     }),
    ...(payload.category && { Category__c : payload.category }),
    ...(payload.subject  && { Subject__c  : payload.subject  })
  };

  const res = await axios.post(
    `${SF_BASE}/services/data/v64.0/sobjects/Lead/`,
    body,
    {
      headers: {
        Authorization                : `Bearer ${token}`,
        'Content-Type'               : 'application/json',
        'Sforce-Duplicate-Rule-Header': 'allowSave=true'
      }
    }
  );

  const id = res.data?.id;
    if (!id) throw new Error(`Lead insert failed: ${JSON.stringify(res.data?.errors)}`);
  console.log(`[SF] Lead created: ${id}`);
  return id;
}

/* ─────────────────────────────────────────────────
   6.  Insert Case (category !== 'purchase')
───────────────────────────────────────────────── */
async function insertCase(token, contactId, payload) {
  const SF_BASE = process.env.SF_BASE_URL;

  const body = {
    ContactId    : contactId,
    SuppliedEmail: payload.email,
    Subject      : payload.subject,
    Origin       : 'Website',
    Description  : payload.description,
    ...(payload.state       && { State__c        : payload.state       }),
    ...(payload.city        && { City__c         : payload.city        }),
    ...(payload.subject     && { Subject__c      : payload.subject     }),
    ...(payload.productType && { Product_Type__c : payload.productType })
  };

  console.log('[SF] insertCase body:', body);

  const res = await axios.post(
    `${SF_BASE}/services/data/v64.0/sobjects/Case/`,
    body,
    {
      headers: {
        Authorization : `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!res.data?.success) {
    throw new Error(`Case insert failed: ${JSON.stringify(res.data?.errors)}`);
  }

  const id = res.data?.id;
    if (!id) throw new Error(`Case insert failed: no id returned, response: ${JSON.stringify(res.data)}`);
  console.log(`[SF] Case created: ${id}`);
  return id;
}

async function getSentimentFromCaseID(token, caseId) {
  const SF_BASE = process.env.SF_BASE_URL;

  const soql = `SELECT Case_Id__c, Sentiment_Score__c, Sentiment_Magnitude__c, Sentiment_Label__c, Summary__c FROM Case WHERE Id='${caseId}'`;

  try {
    // FIX: must be GET, with params + headers in the Axios CONFIG (3rd arg),
    // NOT passed as the request body. Passing them as body caused 401 because
    // the Authorization header was never actually sent.
    const res = await axios.get(
      `${SF_BASE}/services/data/v64.0/query`,
      {
        params : { q: soql },
        headers: {
          Authorization : `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[SF] getSentimentFromCaseID response:`, res.data);

    if (res.data?.totalSize > 0) {
      const record = res.data.records[0];
      console.log(`[SF] Sentiment data for Case ${caseId}:`, record);
      return {
        caseId     : record.Case_Id__c,
        score      : record.Sentiment_Score__c,
        magnitude  : record.Sentiment_Magnitude__c,
        label      : record.Sentiment_Label__c,
        summary    : record.Summary__c
      };
    } else {
      console.log(`[SF] No Case found with ID ${caseId}.`);
      return null;
    }

  } catch (error) {
    console.error(`[SF] Error fetching sentiment for Case ${caseId}:`, error.response?.data || error.message);
    return null;
  }
}

module.exports = { getSFToken, findContact, insertAccount, insertContact, insertLead, insertCase, getSentimentFromCaseID };