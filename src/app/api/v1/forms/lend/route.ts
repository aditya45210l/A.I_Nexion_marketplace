import connectToDatabase from "@/lib/db/db.confing";
import { NextRequest } from "next/server";
import APIKey from "@/lib/db/models/ApiKey.model";
import {  encryptAPIKey } from "@/lib/EncryptDecript";

export const POST = async (res: NextRequest) => {
  try {
    const body = await res.json();

    await connectToDatabase();

    const prepareKey = {
      provider: body.provider,
      model: body.model,
      encryptedKey: encryptAPIKey(body.key),
      pricing: {
        ratePerCall: Number(body.pricePerCall),
      },
      termAndConduction: body.termAndConduction,
      lenderAddress: body.lenderAddress,
    };
    console.log("Prepared Key:", prepareKey);

    // Check for existing key with the same provider and model

    const newKey = await APIKey.create(prepareKey);
    if (!newKey) {
      return Response.json(
        { message: "Failed to create API key", success: false },
        { status: 500 }
      );
    }
    console.log("New Key Created:", newKey);

    return Response.json(
      { message: "Form submitted successfully", success: true },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
  }
};
