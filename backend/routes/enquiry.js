// routes/enquiry.js
const express = require('express');
const router  = express.Router();

const { getSFToken, findContact, insertAccount, insertContact, insertLead, insertCase, getSentimentFromCaseID } = require('../services/salesforce');
const { getMCToken, fireJourneyEvent } = require('../services/marketingCloud');

/* ─────────────────────────────────────────────────
   POST /api/enquiry  (mounted as '/' in server.js)
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

  // Prepend country code — strip leading 0 or existing +91 first to avoid doubles
  const normalizedMobile = '91' + mobile?.toString().replace(/^(\+91|91|0)/, '').trim();

  console.log('[Route] Incoming payload:', req.body);
  console.log('[Route] normalizedMobile:', normalizedMobile);

  // ── Step 1: Get Salesforce token ──────────────────
  let sfToken;
  try {
    sfToken = await getSFToken();
  } catch (err) {
    console.error('[SF] Token error:', err.message);
    return res.status(500).json({
      success: false,
      step   : 'sf_auth',
      message: 'Failed to authenticate with Salesforce. Please try again later.'
    });
  }

  // ── Step 2: Check if contact exists ──────────────
  // NOTE: null = not found (valid), only throw = real error
  let contactId;
  try {
    contactId = await findContact(sfToken, email, normalizedMobile);
  } catch (err) {
    console.error('[SF] findContact error:', err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      step   : 'sf_find_contact',
      message: 'Failed to query Salesforce contacts. Please try again later.'
    });
  }

  // ── Step 3: If no contact, create Account + Contact
  if (!contactId) {
    try {
      const accountId = await insertAccount(sfToken, { firstName, lastName, mobile: normalizedMobile });
      console.log('[Route] Account created:', accountId);

      contactId = await insertContact(sfToken, accountId, { firstName, lastName, email, mobile: normalizedMobile });
      console.log('[Route] Contact created:', contactId);
    } catch (err) {
      console.error('[SF] Account/Contact creation error:', err.response?.data || err.message);
      return res.status(500).json({
        success: false,
        step   : 'sf_create_contact',
        message: err.response?.data?.[0]?.message || 'Failed to create Salesforce Account/Contact. Please try again later.'
      });
    }
  }

  // ── Step 4: Create Lead (purchase) or Case (all others)
  const normalizedCategory = category?.trim().toLowerCase();
  const isPurchase         = normalizedCategory === 'purchase';

  console.log(`[Route] category: "${category}" | normalizedCategory: "${normalizedCategory}" | isPurchase: ${isPurchase}`);
  console.log(`[Route] Will create: ${isPurchase ? 'LEAD' : 'CASE'}`);

  let leadId, caseId, score, magnitude, label, summary;
  try {
    if (isPurchase) {
      leadId = await insertLead(sfToken, {
        firstName, lastName, email,
        mobile: normalizedMobile,
        state, city, category, subject, description
      });
      console.log('[Route] Lead flow completed, leadId:', leadId);
    } else {
      caseId = await insertCase(sfToken, contactId, {
        email, state, city, subject, productType, description
      });

      if(!caseId) throw new Error('Case creation failed: no caseId returned');

      const sentimentFromCase = await getSentimentFromCaseID(sfToken, caseId);
      console.log('[Route] Case flow completed, caseId:Sentiment', sentimentFromCase);
      if(!sentimentFromCase) throw new Error('Failed to get sentiment from case ID');

        score = sentimentFromCase.score;
        magnitude = sentimentFromCase.magnitude;
        label = sentimentFromCase.label;
        summary = sentimentFromCase.summary;

    }
  } catch (err) {
    console.error(`[SF] ${isPurchase ? 'Lead' : 'Case'} creation error:`, err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      step   : isPurchase ? 'sf_create_lead' : 'sf_create_case',
      message: err.response?.data?.[0]?.message || `Failed to create Salesforce ${isPurchase ? 'Lead' : 'Case'}. Please try again later.`
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
      step   : 'mc_auth',
      message: 'Salesforce records saved but failed to authenticate with Marketing Cloud.'
    });
  }

  // ── Step 6: Fire Journey Builder event ───────────
  try {
    await fireJourneyEvent(mcToken, contactId, {
      firstName, lastName, email,
      mobile: normalizedMobile,
      state, city, category, subject, productType, description,
      caseId, summary, score, magnitude, label
    });
    console.log('[MC] Journey event fired successfully');
  } catch (err) {
    console.error('[MC] Journey event error:', err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      step   : 'mc_journey',
      message: 'Salesforce records saved but failed to trigger Marketing Cloud journey.'
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