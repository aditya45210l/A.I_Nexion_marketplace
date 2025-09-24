import axios from "axios";
import connectToDatabase from "../db/db.confing";
import ApiKeyModel from "../db/models/ApiKey.model";

export const fetchActiveKeys = async () => {

  console.log("Fetching active keys from server...");

  try {
    const data = (await axios.get("/api/v1/fetch/fetch-active-keys")).data;
    console.log("data: ",data);
    return data.keys;
  } catch (error) {
    console.error("Error fetching keys:", error);
    return [];
  }
};
