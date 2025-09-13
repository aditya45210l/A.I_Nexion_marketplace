import mongoose from "mongoose";
import { DB_URL } from "../env";

// 1. Declare a variable to hold the connection state
let isConnected: boolean = false;

const connectToDatabase = async () => {
  // 2. Check if a connection already exists
  if (isConnected) {
    console.log("Using existing database connection.");
    return; // Exit the function, no need to connect again
  }

  // 3. If not connected, proceed with a new connection
  try {
    if (!DB_URL) {
      throw new Error("Database URL is not defined.");
    }
    await mongoose.connect(DB_URL);
    isConnected = true; // 4. Update the connection state
    console.log("New database connection established.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;