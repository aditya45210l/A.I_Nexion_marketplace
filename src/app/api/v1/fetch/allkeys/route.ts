import connectToDatabase from "@/lib/db/db.confing";
import ApiKeyModel from "@/lib/db/models/ApiKey.model";
import { NextRequest } from "next/server";

export const GET = async () => {
  console.log("Fetch all keys API called");

try{
      connectToDatabase();
  // Logic to fetch all keys from the database
  const keys = await ApiKeyModel.find({status:'active'}).exec();
  console.log("Fetched Keys:", keys);

  return Response.json({
    message: "All Keys fetched successfully",
    keys: keys,
  });
}catch(error){
    console.error("Error fetching keys:", error);
    return Response.json({
        message: "Error fetching keys",
        error: error,
    }, { status: 500 } );
}
};
