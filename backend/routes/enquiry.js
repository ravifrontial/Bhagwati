// routes/enquiry.js
const express = require('express');
const router  = express.Router();
const { getSFToken, findContact, insertLead, insertAccount, insertContact } = require('../services/salesforce');
const { getMCToken, fireJourneyEvent } = require('../services/marketingCloud');

/* ─────────────────────────────────────────────────
   Helper: extract a clean error message from
   axios errors (SF returns array of error objects)
   Also logs the full response body so you can see
   exactly what SF/MC returned.
───────────────────────────────────────────────── */
function extractError(err) {
  if (err.response) {
    const data   = err.response.data;
    const status = err.response.status;
    // Always log full body for debugging
    console.error(`[API error] HTTP ${status}:`, JSON.stringify(data, null, 2));
    // Salesforce wraps errors in an array: [{ message, errorCode }]
    if (Array.isArray(data) && data[0]?.message) return `[${data[0].errorCode}] ${data[0].message}`;
    if (data?.error_description) return data.error_description;
    if (data?.message)           return data.message;
    return `HTTP ${status}`;
  }
  // Network / timeout / no response
  console.error('[API error] No response:', err.message);
  return err.message || 'Unknown error';
}

/* ─────────────────────────────────────────────────
   POST /api/enquiry
   Body: { firstName, lastName, email, mobile,
           state, city, category, subject,
           productType, description }

   Response shape (always JSON):
   {
     success: true | false,
     sfSaved: true | false,       // were SF records saved?
     mcSent:  true | false,       // was MC event fired?
     contactKey: string | null,
     steps: [                     // per-step result log
       { step, status, message }
     ],
     error: string | null         // top-level error if total failure
   }
───────────────────────────────────────────────── */
router.post('/', async (req, res) => {
  const payload = req.body;
  const steps   = [];
  let sfSaved    = false;
  let mcSent     = false;
  let contactKey = null;

  /* ── STEP 0: Salesforce Auth ── */
  let sfToken;
  try {
    sfToken = await getSFToken();
    steps.push({ step: 'SF Auth', status: 'ok', message: 'Token obtained' });
  } catch (err) {
    const msg = extractError(err);
    steps.push({ step: 'SF Auth', status: 'fail', message: msg });
    return res.status(502).json({ success: false, sfSaved, mcSent, contactKey, steps, error: `Salesforce auth failed: ${msg}` });
  }

  /* ── STEP 1: Check contact exists ── */
  try {
    contactKey = await findContact(sfToken, payload.email, payload.mobile);
    steps.push({
      step   : 'Contact Lookup',
      status : 'ok',
      message: contactKey ? `Existing contact found: ${contactKey}` : 'No existing contact'
    });
  } catch (err) {
    const msg = extractError(err);
    steps.push({ step: 'Contact Lookup', status: 'fail', message: msg });
    return res.status(502).json({ success: false, sfSaved, mcSent, contactKey, steps, error: `Contact lookup failed: ${msg}` });
  }

  /* ── STEPS 2-4: New contact flow ──
     Order: Account → Contact → Lead
  ── */
  if (!contactKey) {

    /* STEP 2: Insert Account */
    let accountId;
    try {
      accountId = await insertAccount(sfToken, payload);
      steps.push({ step: 'Insert Account', status: 'ok', message: `Account created: ${accountId}` });
    } catch (err) {
      const msg = extractError(err);
      steps.push({ step: 'Insert Account', status: 'fail', message: msg });
      return res.status(502).json({ success: false, sfSaved, mcSent, contactKey, steps, error: `Account creation failed: ${msg}` });
    }

    /* STEP 3: Insert Contact (linked to account) */
    try {
      contactKey = await insertContact(sfToken, accountId, payload);
      steps.push({ step: 'Insert Contact', status: 'ok', message: `Contact created: ${contactKey}` });
    } catch (err) {
      const msg = extractError(err);
      steps.push({ step: 'Insert Contact', status: 'fail', message: msg });
      return res.status(502).json({ success: false, sfSaved, mcSent, contactKey, steps, error: `Contact creation failed: ${msg}` });
    }

    /* STEP 4: Insert Lead */
    try {
      await insertLead(sfToken, payload);
      steps.push({ step: 'Insert Lead', status: 'ok', message: 'Lead record created' });
    } catch (err) {
      const msg = extractError(err);
      steps.push({ step: 'Insert Lead', status: 'fail', message: msg });
      return res.status(502).json({ success: false, sfSaved, mcSent, contactKey, steps, error: `Lead creation failed: ${msg}` });
    }

  }

  sfSaved = true;

  /* ── STEP 5: Marketing Cloud Auth ── */
  let mcToken;
  try {
    mcToken = await getMCToken();
    steps.push({ step: 'MC Auth', status: 'ok', message: 'Token obtained' });
  } catch (err) {
    const msg = extractError(err);
    steps.push({ step: 'MC Auth', status: 'fail', message: msg });
    // SF saved — partial success
    return res.status(207).json({
      success: false, sfSaved, mcSent, contactKey, steps,
      error: `Salesforce records saved ✓ — Marketing Cloud auth failed: ${msg}`
    });
  }

  /* ── STEP 6: Fire MC Journey Event ── */
  try {
    await fireJourneyEvent(mcToken, contactKey, payload);
    mcSent = true;
    steps.push({ step: 'MC Journey Event', status: 'ok', message: 'Event fired successfully' });
  } catch (err) {
    const msg = extractError(err);
    steps.push({ step: 'MC Journey Event', status: 'fail', message: msg });
    // SF saved — partial success
    return res.status(207).json({
      success: false, sfSaved, mcSent, contactKey, steps,
      error: `Salesforce records saved ✓ — Journey entry failed: ${msg}`
    });
  }

  /* ── Full success ── */
  return res.status(200).json({ success: true, sfSaved, mcSent, contactKey, steps, error: null });
});

module.exports = router;