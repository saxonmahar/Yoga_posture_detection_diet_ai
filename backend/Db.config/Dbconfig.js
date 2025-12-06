import mongoose from "mongoose";

async function connectDB() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing");
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "YogaAi",
    });
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
  }
}

export default connectDB;