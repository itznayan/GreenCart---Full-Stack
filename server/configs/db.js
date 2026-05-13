import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected"),
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/greencart`, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1); // Exit if database connection fails
  }
};

export default connectDB;
