const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config();

// Your App's credentials from Facebook Developer Console
const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3001/auth/instagram/callback';

// Webhook verification endpoint
router.get('/webhook', (req, res) => {
    // Your verify token from .env
    const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN;
    
    // Parse params from the webhook verification request
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    // Check if a token and mode were sent
    if (mode && token) {
        // Check the mode and token sent are correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Respond with 200 OK and challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Webhook POST endpoint to receive updates
router.post('/webhook', (req, res) => {
    console.log('Received webhook:', req.body);
    res.status(200).send('EVENT_RECEIVED');
});

// Step 1: Redirect to Instagram's authorization page
router.get('/instagram', (req, res) => {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    res.redirect(authUrl);
});

// Step 2: Handle the callback from Instagram
router.get('/instagram/callback', async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
        return res.status(400).json({ error: 'Authorization code not received' });
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URI,
                code: code
            })
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            throw new Error(tokenData.error_message || 'Failed to get access token');
        }

        // Exchange short-lived token for long-lived token
        const longLivedTokenResponse = await fetch(
            `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${CLIENT_SECRET}&access_token=${tokenData.access_token}`
        );

        const longLivedTokenData = await longLivedTokenResponse.json();

        if (longLivedTokenData.error) {
            throw new Error(longLivedTokenData.error_message || 'Failed to get long-lived token');
        }

        // Send the token to the frontend or store it securely
        res.json({
            success: true,
            message: 'Successfully authenticated with Instagram',
            token: longLivedTokenData.access_token,
            expires_in: longLivedTokenData.expires_in
        });

    } catch (error) {
        console.error('Instagram authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to authenticate with Instagram',
            error: error.message
        });
    }
});

// Step 3: Endpoint to refresh the long-lived token
router.get('/instagram/refresh_token', async (req, res) => {
    const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    try {
        const response = await fetch(
            `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`
        );

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'Failed to refresh token');
        }

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            token: data.access_token,
            expires_in: data.expires_in
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to refresh token',
            error: error.message
        });
    }
});

module.exports = router; 