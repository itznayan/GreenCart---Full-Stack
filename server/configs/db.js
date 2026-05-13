import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not set");
    }

    mongoose.set("bufferCommands", false);

    mongoose.connection.once("connected", () => {
      console.log("Database Connected");
    });

    await mongoose.connect(mongoUri, {
      dbName: "greencart",
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
};

export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

export default connectDB;
