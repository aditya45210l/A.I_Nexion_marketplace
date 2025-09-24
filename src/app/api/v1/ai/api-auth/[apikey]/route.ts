
import connectToDatabase from "@/lib/db/db.confing";
import SessionModel from "@/lib/db/models/Session.model";
import { backendWs as webSocketService } from "@/lib/backend-actions/backendWs";
import {
  createAuthVerifyMessageWithJWT,
  createECDSAMessageSigner,
  parseAnyRPCResponse,
  RPCMethod,
} from "@erc7824/nitrolite";
import { NextRequest } from "next/server";
import { getSocketBalance, getSocketTransafer } from "@/lib/backend-actions/helperSocket";

export async function sendAndWait(
  payload: string,
  expectedMethod: string,
  timeout = 5000
) {
  return new Promise((resolve, reject) => {
  try{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const listener = (data: any) => {
      try {
        const response = parseAnyRPCResponse(JSON.stringify(data));
        // console.log('all response: ',response);
        if (response.method === expectedMethod) {
          webSocketService.removeMessageListener(listener);
          resolve(response);
        }
        if(response.method === RPCMethod.Error){
          console.log('error: ', response )
        }
      } catch (err) {
        reject(err);
      }
    };

    // Attach listener BEFORE sending payload
    webSocketService.addMessageListener(listener);

    // Send the payload only after listener is ready
    webSocketService.send(payload);

    // Safety timeout
    setTimeout(() => {
      webSocketService.removeMessageListener(listener);
      reject(new Error(`Timeout waiting for ${expectedMethod}`));
    }, timeout);
  }catch(err){
    console.log(err);
    reject(err);
  }
  });
}

export const POST = async (
  res: NextRequest,
  { params }: { params: { apikey: string } }
) => {
  try {
    // const body = await res.json();
    // console.log(body);
    const data = await params;
    // console.log(data.apikey);
    connectToDatabase();
    const session = await SessionModel.findOne({ proxyKey: data.apikey });
    if (!session) {
      throw new Error("Session not found");
    }
    // console.log(session);
    const jwtToken = session.keyAuth.jwt_auth;
    console.log("backend jwtToken: ", jwtToken);
    // webSocketService.addMessageListener(handleMessage);
    webSocketService.connect();
    const auth_jwt_payload = await createAuthVerifyMessageWithJWT(jwtToken);
    console.log("payload", auth_jwt_payload);

    const auth_response = await sendAndWait(
      auth_jwt_payload,
      "auth_verify",
      2000
    );
    if (!auth_response!.params.success) {
      throw new Error("fail to verify jwt & session");
    }
    console.log("auth resonse", auth_response);
      const sessionSigner = createECDSAMessageSigner(session.keyAuth.privateKey);

      
const balance = await getSocketBalance(sessionSigner);
    console.log(JSON.stringify(balance.params.ledgerBalances[0]));
    console.log(session.lenderAddress);
    console.log('price percall: ',session.ratePerCall)
    const transfer = await getSocketTransafer(sessionSigner,session.lenderAddress,session.ratePerCall,'usdc');
    console.log("transfer: ",JSON.stringify(transfer));

    if(!transfer.signatures){
          return Response.json(
      {
        message: "Transfer Faild?",
        success: false,
        data: transfer
      },
      { status: 500 }
    );
  }
    

    return Response.json(
      { message: "Form submitted successfully", success: true, data: session, transfet:transfer, balance:balance.params.ledgerBalances[0] },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return Response.json(
      {
        message: "Error fetching keys",
  error: err?.message || "Unknown error",   // <-- proper serialization
      },
      { status: 200 }
    );
  }
};
