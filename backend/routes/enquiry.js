// routes/enquiry.js
const express = require('express');
const router  = express.Router();

const { getSFToken, findContact, insertAccount, insertContact, insertLead, insertCase } = require('../services/salesforce');
const { getMCToken, fireJourneyEvent } = require('../services/marketingCloud');

/* ─────────────────────────────────────────────────
   POST /api/submit-enquiry
───────────────────────────────────────────────── */
router.post('/', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobile,
    state,
    city,
    category,
    subject,
    productType,
    description
  } = req.body;

  // ── DEBUG: log every field individually so you can
  //    see exactly what value category holds
  console.log('[Route] Incoming payload:', req.body);
  console.log('[Route] category raw value:', JSON.stringify(category));
  console.log('[Route] category lowercased:', category?.toLowerCase());

  // ── Step 1: Get Salesforce token ──────────────────
  let sfToken;
  try {
    sfToken = await getSFToken();
  } catch (err) {
    console.error('[SF] Token error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Salesforce.'
    });
  }

  // ── Step 2: Check if contact exists ──────────────
  let contactId; let leadId; let caseId;
  try {
    contactId = await findContact(sfToken, email, mobile);
  } catch (err) {
    console.error('[SF] findContact error:', err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to query Salesforce contacts.'
    });
  }

  // ── Step 3: If no contact, create Account + Contact
  if (!contactId) {
    try {
      const accountId = await insertAccount(sfToken, { firstName, lastName, mobile });
      contactId = await insertContact(sfToken, accountId, { firstName, lastName, email, mobile });
    } catch (err) {
      console.error('[SF] Account/Contact creation error:', err.response?.data || err.message);
      return res.status(500).json({
        success: false,
        message: err.response?.data?.[0]?.message || 'Failed to create Salesforce Account/Contact.'
      });
    }
  }

  // ── Step 4: Create Lead (purchase) or Case (all others)
  //
  // Trim + lowercase so "Purchase ", "PURCHASE", "purchase" all match.
  // Anything that is NOT exactly "purchase" → Case.
  const normalizedCategory = category?.trim().toLowerCase();
  const isPurchase = normalizedCategory === 'purchase';

  console.log(`[Route] normalizedCategory: "${normalizedCategory}" | isPurchase: ${isPurchase}`);
  console.log(`[Route] Will create: ${isPurchase ? 'LEAD' : 'CASE'}`);

  try {
    if (isPurchase) {
      const sfLeadId = await insertLead(sfToken, {
        firstName,
        lastName,
        email,
        mobile,
        state,
        city,
        category,
        subject,
        description
      });
        leadId = sfLeadId;
      console.log('[Route] Lead flow completed', sfLeadId);
    } else {
     const sfCase = await insertCase(sfToken, contactId, {
        email,
        state,
        city,
        subject,
        productType,
        description
      });
      caseId = sfCase;
      console.log('[Route] Case flow completed', caseId);
    }
  } catch (err) {
    console.error(`[SF] ${isPurchase ? 'Lead' : 'Case'} creation error:`, err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: err.response?.data?.[0]?.message || `Failed to create Salesforce ${isPurchase ? 'Lead' : 'Case'}.`
    });
  }

  // ── Step 5: Get Marketing Cloud token ────────────
  let mcToken;
  try {
    mcToken = await getMCToken();
  } catch (err) {
    console.error('[MC] Token error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Marketing Cloud.'
    });
  }

  // ── Step 6: Fire Journey Builder event ───────────
  try {
    await fireJourneyEvent(mcToken, contactId, {
      firstName,
      lastName,
      email,
      mobile,
      state,
      city,
      category,
      subject,
      productType,
      description,
      caseId
    });
  } catch (err) {
    console.error('[MC] Journey event error:', err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: 'Salesforce records created but failed to trigger Marketing Cloud journey.'
    });
  }

  // ── All steps succeeded ───────────────────────────
  console.log('[Route] Enquiry submitted successfully');
  return res.status(200).json({
    success: true,
    message: 'Enquiry submitted successfully!'
  });
});

module.exports = router;