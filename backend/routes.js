const express = require('express');
const axios = require('axios');
const router = express.Router();

// Salesforce and Marketing Cloud configs from .env
const SF_BASE_URL = process.env.SF_BASE_URL;
const SF_CLIENT_ID = process.env.SF_CLIENT_ID;
const SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET;

const MC_SUBDOMAIN = process.env.MC_SUBDOMAIN;
const MC_CLIENT_ID = process.env.MC_CLIENT_ID;
const MC_CLIENT_SECRET = process.env.MC_CLIENT_SECRET;
const MC_MID = process.env.MC_MID;
const MC_EVENT_DEF_KEY = process.env.MC_EVENT_DEF_KEY;

// Helper function to get Salesforce token
async function getSalesforceToken() {
  const tokenUrl = `${SF_BASE_URL}/services/oauth2/token?grant_type=client_credentials&client_id=${encodeURIComponent(SF_CLIENT_ID)}&client_secret=${encodeURIComponent(SF_CLIENT_SECRET)}`;
  const response = await axios.post(tokenUrl);
    console.log('Salesforce token response:', response.data);
  return response.data.access_token;
}

// Helper function to get Marketing Cloud token
async function getMarketingCloudToken() {
  const tokenUrl = `https://${MC_SUBDOMAIN}.auth.marketingcloudapis.com/v2/token`;
  const response = await axios.post(tokenUrl, {
    grant_type: 'client_credentials',
    client_id: MC_CLIENT_ID,
    client_secret: MC_CLIENT_SECRET,
    account_id: MC_MID
  });
  console.log('Marketing Cloud token response:', response.data);
  return response.data.access_token;
}

// POST /api/submit-enquiry
router.post('/submit-enquiry', async (req, res) => {
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

  console.log('Incoming payload:', req.body);

  let sfToken, mcToken, contactKey;

  try {
    // Step 1: Get Salesforce token
    sfToken = await getSalesforceToken();
    console.log('Salesforce token obtained');

    // Step 2: Check if contact exists
    const soql = `SELECT Id FROM Contact WHERE Email='${email}' OR Phone='${mobile}'`;
    const queryUrl = `${SF_BASE_URL}/services/data/v64.0/query?q=${encodeURIComponent(soql)}`;
    const queryResponse = await axios.get(queryUrl, {
      headers: {
        'Authorization': `Bearer ${sfToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Salesforce contact query successful, totalSize:', queryResponse.data.totalSize);

    if (queryResponse.data.totalSize > 0) {
      contactKey = queryResponse.data.records[0].Id;
      console.log(`Existing contact found: ${contactKey}`);
    } else {
      // Step 3: Create Account
      const accountData = {
        Name: `${firstName} ${lastName}`,
        Phone: mobile
      };
      const accountResponse = await axios.post(`${SF_BASE_URL}/services/data/v64.0/sobjects/account/`, accountData, {
        headers: {
          'Authorization': `Bearer ${sfToken}`,
          'Content-Type': 'application/json'
        }
      });
      const accountId = accountResponse.data.id;
      console.log(`Account created with ID: ${accountId}`);

      // Step 4: Create Contact
      const contactData = {
        AccountId: accountId,
        FirstName: firstName,
        LastName: lastName,
        Phone: mobile,
        Email: email
      };
      const contactResponse = await axios.post(`${SF_BASE_URL}/services/data/v64.0/sobjects/contact/`, contactData, {
        headers: {
          'Authorization': `Bearer ${sfToken}`,
          'Content-Type': 'application/json',
          'Sforce-Duplicate-Rule-Header': 'allowSave=true'
        }
      });

      console.log(`Contact created with ID: ${contactResponse.data.id}`);

      // Step 5: Create Lead
      const leadData = {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        MobilePhone: mobile,
        State__c: state,
        City__c: city,
        Category__c: category,
        Subject__c: subject,
        Status: 'New',
        Description: description
      };
      await axios.post(`${SF_BASE_URL}/services/data/v64.0/sobjects/lead/`, leadData, {
        headers: {
          'Authorization': `Bearer ${sfToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Lead created successfully');
      contactKey = contactResponse.data.id;
    }

    // Step 6: Get Marketing Cloud token
    mcToken = await getMarketingCloudToken();

    // Step 7: Send event to Marketing Cloud
    const eventData = {
      ContactKey: contactKey,
      EventDefinitionKey: MC_EVENT_DEF_KEY,
      Data: {
        contactKey: contactKey,
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobile: mobile,
        state: state,
        city: city,
        category: category,
        subject: subject,
        productType: productType,
        description: description,
        leadStatus: 'new'
      }
    };
    await axios.post(`https://${MC_SUBDOMAIN}.rest.marketingcloudapis.com/interaction/v1/events`, eventData, {
      headers: {
        'Authorization': `Bearer ${mcToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Marketing Cloud event sent successfully');

    const responseData = { success: true, message: 'Enquiry submitted successfully!' };
    console.log('Response:', responseData);
    res.json(responseData);

  } catch (error) {
    console.error('Error in submit-enquiry:', error.response?.data || error.message);
    console.error('Error details:', error);
    const errorResponse = {
      success: false,
      message: error.response?.data?.[0]?.message || error.message || 'An error occurred while processing your enquiry.'
    };
    console.log('Error Response:', errorResponse);
    res.status(500).json(errorResponse);
  }
});

module.exports = router;