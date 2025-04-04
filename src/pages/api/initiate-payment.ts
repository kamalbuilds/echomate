import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const uuid = crypto.randomUUID().replace(/-/g, "");

  // TODO: Store the ID field in your database so you can verify the payment later
  const response = NextResponse.json({ id: uuid });
  
  // Set cookie using response object instead of cookies() API
  response.cookies.set({
    name: "payment-nonce",
    value: uuid,
    httpOnly: true,
  });

  console.log(uuid);

  return response;
}
