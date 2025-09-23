import connectToDatabase from "@/lib/db/db.confing";
import ApiKeyModel from "@/lib/db/models/ApiKey.model";
import SessionModel from "@/lib/db/models/Session.model";
import { decryptAPIKey, encryptAPIKey } from "@/lib/actions/EncryptDecript";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
          console.log("api from chat: ", body.apiKey);
          if (!body.apiKey) {
            throw new Error("api Key not available");
          }
          const raw = decodeURIComponent(body.apiKey)
          console.log('raw: ',raw);
          const decryptedApi = decryptAPIKey(raw);
          console.log(decryptedApi);
    console.log('decrypted body: ', body);

  
    return Response.json({decryptedKey: decryptedApi} ,{ status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: error }, { status: 404 });
  }
};
