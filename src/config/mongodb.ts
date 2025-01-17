import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }
    const connectDB = await mongoose.connect(mongoUrl);
    console.log("MONGODB CONNECT: " + connectDB.connection.host);
  } catch (error) {
    console.error("Internal error", error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
