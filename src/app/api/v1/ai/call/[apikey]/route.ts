import connectToDatabase from "@/lib/db/db.confing";
import { NextRequest } from "next/server";
import APIKey from "@/lib/db/models/ApiKey.model";
import { decryptAPIKey, encryptAPIKey } from "@/lib/actions/EncryptDecript";

export const POST = async (
  res: NextRequest,
  { params }: { params: { apikey: string } }
) => {
  try {
    // const body = await res.json();
    // console.log(body);
    const data = await params;
    console.log(data.apikey);
    console.log(
      "key decrypted key: ",
      data.apikey
    );

    return Response.json(
      { message: "Form submitted successfully", success: true },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return Response.json(
      {
        message: "Error fetching keys",
        error: err,
      },
      { status: 500 }
    );
  }
};
