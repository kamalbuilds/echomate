import {
    verifyCloudProof,
    IVerifyResponse,
    ISuccessResult,
  } from "@worldcoin/minikit-js";
import type { NextApiRequest, NextApiResponse } from 'next';
  
  interface IRequestPayload {
    payload: ISuccessResult;
    action: string;
    signal: string | undefined;
  }
  
  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { payload, action, signal } = req.body as IRequestPayload;
    const app_id = process.env.APP_ID as `app_${string}`;
    
    try {
      const verifyRes = (await verifyCloudProof(
        payload,
        app_id,
        action,
        signal
      )) as IVerifyResponse;
      
      console.log(verifyRes);
  
      if (verifyRes.success) {
        // This is where you should perform backend actions if the verification succeeds
        // Such as, setting a user as "verified" in a database
        return res.status(200).json({ verifyRes });
      } else {
        // This is where you should handle errors from the World ID /verify endpoint.
        // Usually these errors are due to a user having already verified.
        return res.status(400).json({ verifyRes });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  