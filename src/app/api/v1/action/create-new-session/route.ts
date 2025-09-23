import connectToDatabase from "@/lib/db/db.confing";
import ApiKeyModel from "@/lib/db/models/ApiKey.model";
import SessionModel from "@/lib/db/models/Session.model";
import { encryptAPIKey, generateProxyKey } from "@/lib/actions/EncryptDecript";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log('body: ',body);
    const preparSessonData = {
      appSessionId: crypto.randomUUID(),
      borrowerAddress: body.borrowerAddress,
      apiKeyId: body.id,
      lenderAddress: body.lenderAddress,
      signature: body.signature,
      status: "active",
      provider: body.provider,
      model: body.model,
      proxyKey: generateProxyKey(),
      lender_apiKey: body.apiKey,
      keyAuth:{
        privateKey:body.privateKey,
        proxyAddress:body.proxyAddress,
        jwt_auth:body.jwt_auth,
        proxy_exp_time:body.proxy_exp_time

      }
    };
    console.log("preparSessonData: ",preparSessonData);
    connectToDatabase();
    const Session = await SessionModel.create(preparSessonData);
    if (!Session) {
      throw new Error("Session not created");
    }
    console.log("apiCardId: ", body.id);
    // const ApiKey = await ApiKeyModel.findOne({id:body.id});
    const ApiKeyCard = await ApiKeyModel.findOneAndUpdate(
      { id: body.id },
      { status: "rented" }
    );
    if (!ApiKeyCard) {
      throw new Error("Fail to update key data!");
    }
    console.log("updated Api Card: ", ApiKeyCard);

    return Response.json({ data: Session }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: error }, { status: 404 });
  }
};
