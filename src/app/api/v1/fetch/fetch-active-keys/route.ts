import connectToDatabase from "@/lib/db/db.confing";
import ApiKeyModel from "@/lib/db/models/ApiKey.model";

export const GET = async () => {
  console.log("Fetch all keys API called");

try{
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

  return Response.json({
    message: "All Keys fetched successfully",
    keys: plainKeys,
  });
}catch(error){
    console.error("Error fetching keys:", error);
    return Response.json({
        message: "Error fetching keys",
        error: error,
    }, { status: 500 } );
}
};
