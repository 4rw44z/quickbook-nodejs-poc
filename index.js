// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const OAuthClient = require('intuit-oauth');

// Initialize an Express application
const app = express();
const port = 3000;
const REALM_ID = process.env.REALM_ID;
const MINOR_VERSION = process.env.MINOR_VERSION;
// Configure the OAuthClient with credentials and environment
const oauthClient = new OAuthClient({
    clientId: process.env.CLIENT_ID, // QuickBooks OAuth2 Client ID
    clientSecret: process.env.CLIENT_SECRET, // QuickBooks OAuth2 Client Secret
    environment: process.env.ENVIRONMENT, // 'sandbox' or 'production'
    redirectUri: process.env.REDIRECT_URL // Redirect URI for OAuth callbacks
});

// const supabase = supabaseClient.createClient({
//     apiKey: '<API_KEY>',
//     project: '<PROJECT_ID>'
//   });

const refreshToken = () => {
    if(!oauthClient.isAccessTokenValid()){
        oauthClient.refresh()
            .then(function(authResponse) {
                console.log('Tokens refreshed : ' + JSON.stringify(authResponse.json()));
            })
            .catch(function(e) {
                console.error("The error message is :"+e.originalMessage);
                console.error(e.intuit_tid);
            });
     
     }
}

app.get('/', (req, res) => {
    if(oauthClient.isAccessTokenValid()){
        res.send("Hello I am working my friend Supabase <3");
    }
    res.redirect('/auth');

});

// Route to initiate the OAuth flow
app.get('/auth', (req, res) => {
    // Generate the authorization URL for QuickBooks
    const authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
        state: 'Init' // State to protect against CSRF attacks
    });
    // Redirect user to the QuickBooks authorization page
    res.redirect(authUri);
});

// Callback route for handling the response from QuickBooks
app.get('/callback', async (req, res) => {
    const parseRedirect = req.url;

    try {
        // Create an OAuth token using the callback URL
        const authResponse = await oauthClient.createToken(parseRedirect);
        // Redirect to the items route after successful authentication
        console.log(authResponse);
        res.redirect('/items');
    } catch (e) {
        console.error('Error', e);
    }
});

// Route to fetch items data from QuickBooks
app.get('/items', async (req, res) => {
    try {
        if(!oauthClient.isAccessTokenValid()){
           await refreshToken();
        }
        // Make an API call to QuickBooks to fetch payments
        const selectQuery = 'select * from Item'
        const response = await oauthClient.makeApiCall({
            url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${REALM_ID}/query?query=${selectQuery}&minorversion=${MINOR_VERSION}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Send the fetched data as JSON response
        res.json(response.body);
    } catch (e) {
        console.error(e);
        res.status(500).send('Failed to fetch items');
    }
});

// Route to fetch items based on Type and category from QuickBooks
app.get('/items/filter', async (req, res) => {
    const { category } = req.query;

    if (!category) {
        return res.status(400).send('category is required');
    }

    try {
        // Make an API call to QuickBooks to fetch items based on Type and category
        console.log(`https://sandbox-quickbooks.api.intuit.com//v3/company/9341452815412836/query?query=select * from Item where Type='${category}'&minorversion=73`);

        const response = await oauthClient.makeApiCall({
            url: `https://sandbox-quickbooks.api.intuit.com//v3/company/${REALM_ID}/query?query=select * from Item where Type='${category}'&minorversion=${MINOR_VERSION}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Send the fetched data as JSON response
        res.json(response.body);
    } catch (e) {
        console.error(e);
        res.status(500).send('Failed to fetch items');
    }
});

app.get('/items/fetchSKU', async (req, res) => {
    const { SKU } = req.query;

    if (!SKU) {
        return res.status(400).send('SKU is required');
    }

    try {
        // Make an API call to QuickBooks to fetch items based on Type and category
        // console.log(`https://sandbox-quickbooks.api.intuit.com//v3/company/9341452815412836/query?query=select * from Item where Type='${SKU}'&minorversion=73`);
        //https://sandbox.qbo.intuit.com/app/items
        //t-01-12

        const response = await oauthClient.makeApiCall({
            url: `https://sandbox-quickbooks.api.intuit.com//v3/company/${REALM_ID}/query?query=select * from Item where SKU='${SKU}'&minorversion=${MINOR_VERSION}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Send the fetched data as JSON response
        res.json(response.body);
    } catch (e) {
        console.error(e);
        res.status(500).send('Failed to fetch items');
    }
});
// Route to fetch a specific item by ID
app.get('/items/:id', async (req, res) => {
    const itemId = Number(req.params.id);
    try {

        if (isNaN(itemId)) {
            return res.status(400).send('Invalid item ID');
        }
        // Make an API call to QuickBooks to fetch the item by ID
        const response = await oauthClient.makeApiCall({
            url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${REALM_ID}/item/${itemId}?minorversion=${MINOR_VERSION}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Send the fetched item data as JSON response
        console.log(response.body);
        res.json(response.body);
    } catch (e) {
        console.error(e);
        res.status(e.response.status).send(e.error);
    }
});



// Start the Express server
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});