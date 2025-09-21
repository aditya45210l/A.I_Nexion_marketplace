import connectToDatabase from "@/lib/db/db.confing";
import ApiKeyModel from "@/lib/db/models/ApiKey.model";
import SessionModel from "@/lib/db/models/Session.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  res: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const {address} = await params;
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }
    console.log("address from route", address);
    connectToDatabase();
    const borrowedKeys = await SessionModel.find({borrowerAddress:address}).exec();
    if(!borrowedKeys){
        throw new Error('Borrower Key now found');
    }
    console.log(borrowedKeys);

    return NextResponse.json({ data:borrowedKeys }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
