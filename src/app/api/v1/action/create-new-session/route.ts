import { NextRequest } from "next/server"

export const POST = async(req:NextRequest) =>{
    const body = await req.json();
    console.log("Body in create new session:",body);

    return Response.json({data:body},{ status:200});
}