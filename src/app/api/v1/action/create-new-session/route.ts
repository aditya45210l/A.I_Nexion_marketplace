import connectToDatabase from "@/lib/db/db.confing";
import SessionModel from "@/lib/db/models/Session.model";
import { NextRequest } from "next/server"

export const POST = async(req:NextRequest) =>{
try{
        const body = await req.json();
    console.log("Body in create new session:",body);
    const preparSessonData = {
        appSessionId:crypto.randomUUID(),
        borrowerAddress: body.borrowerAddress,
        apiKeyId: body.id,
        lenderAddress: body.lenderAddress,
        signature:body.signature,
        status:'active',
        provider:body.provider,
        model:body.model,
        api_end_point:body.encryptedKey,

    }
    console.log(preparSessonData);
    connectToDatabase();
    const Session = await SessionModel.create(
        preparSessonData
    );
    if(!Session){
        throw new Error("Session not created");
    }
    
    console.log("Session created:",Session);

    return Response.json({data:Session},{ status:200});
}catch(error){
    console.log(error);
    return Response.json({error:error},{status:404});
}
}