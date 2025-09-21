import connectToDatabase from "../db/db.confing";
import ApiKeyModel from "../db/models/ApiKey.model";

export const fetchActiveKeys = async () => {
  console.log("Fetching active keys from server...");

  try {
    await connectToDatabase();

    const keys = await ApiKeyModel.find({ status: "active" }).exec();

    // Convert Mongoose docs to plain JS objects
    const plainKeys = keys.map((key) => {
      const obj = key.toObject();
      return {
        ...obj,
        _id: obj._id.toString(),
        createdAt: obj.createdAt?.toISOString(),
        updatedAt: obj.updatedAt?.toISOString(),
      };
    });

    console.log("Successfully fetched and converted keys:", plainKeys);

    return plainKeys;
  } catch (error) {
    console.error("Error fetching keys:", error);
    return [];
  }
};
