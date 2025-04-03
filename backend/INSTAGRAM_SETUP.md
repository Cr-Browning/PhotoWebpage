# Instagram Integration Setup Guide

This guide will help you set up the Instagram integration for your photography portfolio website.

## Prerequisites

1. An Instagram account (preferably a business or creator account)
2. A Facebook Developer account

## Step 1: Create a Facebook App

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Log in with your Facebook account
3. Click on "My Apps" in the top right corner
4. Click "Create App"
5. Select "Consumer" as the app type
6. Enter your app name (e.g., "Cameron's Photography Portfolio")
7. Complete the security check and click "Create App"

## Step 2: Set Up Instagram Basic Display API

1. In your Facebook App dashboard, click "Add Products" in the left sidebar
2. Find "Instagram Basic Display" and click "Set Up"
3. Under "User Token Generator", click "Add or Remove Instagram Testers"
4. Add your Instagram account as a tester
5. Go back to the Instagram Basic Display settings
6. Configure the following:
   - Valid OAuth Redirect URIs: `https://yourdomain.com/auth/instagram/callback` (use your actual domain or `http://localhost:3000/auth/instagram/callback` for development)
   - Deauthorize Callback URL: `https://yourdomain.com/auth/instagram/deauthorize`
   - Data Deletion Request URL: `https://yourdomain.com/auth/instagram/data-deletion`
7. Save changes

## Step 3: Accept the Tester Invitation

1. Log in to Instagram
2. Go to Settings > Apps and Websites > Tester Invites
3. Accept the invitation from your Facebook App

## Step 4: Generate an Access Token

1. Go back to your Facebook App dashboard
2. Navigate to Instagram Basic Display > User Token Generator
3. Click "Generate Token" next to your Instagram account
4. Log in to Instagram if prompted
5. Authorize the app to access your Instagram data
6. Copy the generated access token

## Step 5: Configure Your Backend

1. Open the `.env` file in your backend project
2. Replace `YOUR_INSTAGRAM_ACCESS_TOKEN` with the token you copied:
   ```
   INSTAGRAM_ACCESS_TOKEN="your_long_lived_access_token_here"
   ```

## Step 6: Test the Integration

1. Start your backend server: `npm start`
2. Make a request to `http://localhost:3001/api/instagram/media`
3. You should see a JSON response with your Instagram media

## Important Notes

- The access token is valid for 60 days. You'll need to refresh it before it expires.
- To refresh the token, you can implement a token refresh endpoint or manually generate a new token.
- Make sure your Instagram posts have appropriate hashtags (#portrait, #automotive, #fitness, #sports) to categorize them correctly in your gallery.

## Troubleshooting

- If you're not seeing any images, check your Instagram account privacy settings.
- Ensure your Instagram account has public posts.
- Verify that the access token is correctly set in the `.env` file.
- Check the server logs for any error messages.

## Additional Resources

- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Long-Lived Access Tokens](https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens) 