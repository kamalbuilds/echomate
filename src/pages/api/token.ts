import { NextApiRequest, NextApiResponse } from "next";
import { generateRandomAlphanumeric } from "@/lib/util";

import { AccessToken } from "livekit-server-sdk";
import type { AccessTokenOptions, VideoGrant } from "livekit-server-sdk";
import { TokenResult } from "../../lib/types";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

const createToken = (userInfo: AccessTokenOptions, grant: VideoGrant) => {
  const at = new AccessToken(apiKey, apiSecret, userInfo);
  at.addGrant(grant);
  return at.toJwt();
};

export default async function handleToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!apiKey || !apiSecret) {
      res.statusMessage = "Environment variables aren't set up correctly";
      res.status(500).end();
      return;
    }

    // Check if the request method is POST
    if (req.method !== 'POST' && req.method !== 'GET') {
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return;
    }

    // Extract metadata from request body for POST requests
    let metadata = {};
    if (req.method === 'POST' && req.body) {
      metadata = req.body.metadata || {};
    }

    // Ensure roomName ends with echomind
    const roomName = `room-${generateRandomAlphanumeric(4)}-${generateRandomAlphanumeric(4)}-echomind`;
    const identity = `identity-${generateRandomAlphanumeric(4)}`;

    const grant: VideoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    };

    // Ensure metadata is properly stringified and logged
    console.log('Received metadata in token API:', metadata);
    
    // Make sure metadata is a valid object before stringifying
    const metadataObj = typeof metadata === 'object' && metadata !== null ? metadata : {};
    
    // Add additional debugging info
    if (Object.keys(metadataObj).length === 0) {
      console.warn('Warning: Empty metadata object received in token API');
    }
    
    const metadataString = JSON.stringify(metadataObj);
    console.log('Stringified metadata:', metadataString);

    // Create token with metadata
    const token = await createToken({ 
      identity,
      metadata: metadataString
    }, grant);

    const result: TokenResult = {
      identity,
      accessToken: token,
      roomName, // Include roomName in the response
    };

    res.status(200).json(result);
  } catch (e) {
    res.statusMessage = (e as Error).message;
    res.status(500).end();
  }
}