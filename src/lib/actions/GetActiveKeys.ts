import connectToDatabase from "../db/db.confing";
import ApiKeyModel from "../db/models/ApiKey.model";

export const fetchActiveKeys = async () => {
  console.log("Fetching active keys from server...");
  
  try {
    await connectToDatabase();
    
    // Fetch all active keys from the database
    const keys = await ApiKeyModel.find({ status: 'active' }).exec();
    
    // Convert Mongoose documents to plain JavaScript objects
    const plainKeys = keys.map(key => key.toObject());
    
    console.log("Successfully fetched and converted keys:", plainKeys);
    
    return plainKeys;
  } catch (error) {
    console.error("Error fetching keys:", error);
    return [];
  }
};