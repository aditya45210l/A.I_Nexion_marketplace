import connectToDatabase from "@/lib/db/db.confing";
import ApiKeyModel from "@/lib/db/models/ApiKey.model";
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
    const lendedkeys = await ApiKeyModel.find({lenderAddress:address}).exec();
    if(!lendedkeys){
        throw new Error('lended Key now found');
    }
    console.log(lendedkeys);

    return NextResponse.json({ data:lendedkeys }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
