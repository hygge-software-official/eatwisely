import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandlerSentry } from '../../utils/errorHandlerSentry.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appleProductionUrl = 'https://buy.itunes.apple.com/verifyReceipt';
const appleSandboxUrl = 'https://sandbox.itunes.apple.com/verifyReceipt';
const playStorePackageName = 'com.hyggesoftware.eatwisely';

router.post('/validate-receipt', async (req, res) => {
  const { receipt, platform, productId } = req.body;

  try {
    if (platform === 'ios') {
      const result = await validateAppleReceipt(receipt);
      res.json(result);
    } else if (platform === 'android') {
      const result = await validateGoogleReceipt(receipt, productId);
      res.json(result);
    } else {
      res.status(400).json({ error: 'Unknown platform' });
    }
  } catch (error) {
    errorHandlerSentry(res, error, 'Error validating receipt', 500);
  }
});

async function validateAppleReceipt(receipt) {
  try {
    const productionResponse = await sendReceiptToApple(
      receipt,
      appleProductionUrl
    );

    errorHandlerSentry(
      null,
      new Error(
        `Apple Production Response: ${JSON.stringify(productionResponse)}`
      ),
      'Apple production response',
      200
    );

    if (productionResponse && productionResponse.status === 0) {
      return { success: true, message: 'Receipt is valid' };
    }

    if (productionResponse && productionResponse.status === 21007) {
      const sandboxResponse = await sendReceiptToApple(
        receipt,
        appleSandboxUrl
      );

      errorHandlerSentry(
        null,
        new Error(`Apple Sandbox Response: ${JSON.stringify(sandboxResponse)}`),
        'Apple sandbox response',
        200
      );

      if (sandboxResponse && sandboxResponse.status === 0) {
        return { success: true, message: 'Sandbox receipt is valid' };
      }
    }

    errorHandlerSentry(
      null,
      new Error('Invalid receipt'),
      'Receipt validation failed',
      400
    );
    throw new Error('Invalid receipt');
  } catch (error) {
    errorHandlerSentry(null, error, 'Error validating receipt', 500);
    throw error;
  }
}

async function validateGoogleReceipt(purchaseToken, productId) {
  try {
    // console.log('Starting Google receipt validation');
    // console.log('Project number:', 684925830265);
    // console.log('Project ID:', 'eatwisely-f8bfa');

    const keyFile = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, './eatwisely-f8bfa-73f7536e3053.json'),
        'utf8'
      )
    );
    console.log('Key file loaded successfully');
    console.log('Service account email:', keyFile.client_email);

    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        iss: keyFile.client_email,
        scope: 'https://www.googleapis.com/auth/androidpublisher',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
      },
      keyFile.private_key,
      { algorithm: 'RS256' }
    );
    // console.log('JWT token created successfully');

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token response not OK:', tokenResponse.status, errorText);
      throw new Error(
        `Token request failed! Status: ${tokenResponse.status}, Details: ${errorText}`
      );
    }

    const { access_token } = await tokenResponse.json();
    // console.log('Access token obtained successfully');

    const apiUrl = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${playStorePackageName}/purchases/products/${productId}/tokens/${purchaseToken}`;
    console.log('Sending request to Google Play API:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // eatwisely-app-android@eatwisely-f8bfa.iam.gserviceaccount.com

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google API response not OK:', response.status, errorText);
      console.error('Request details:', {
        playStorePackageName,
        productId,
        purchaseToken: purchaseToken.substring(0, 10) + '...', // Log only part of the token for security
      });
      throw new Error(
        `Google API request failed! Status: ${response.status}, Details: ${errorText}`
      );
    }

    const data = await response.json();
    // console.log('Google API response:', data);

    if (data.purchaseState === 0) {
      return { success: true, message: 'Receipt is valid' };
    } else {
      throw new Error('Invalid receipt');
    }
  } catch (error) {
    // console.error('Google receipt validation failed:', error);
    throw new Error(`Google receipt validation error: ${error.message}`);
  }
}

async function sendReceiptToApple(receipt, url) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'receipt-data': receipt,
      password: '4747345f30d3407f9347e6376b75f85c',
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export default router;
