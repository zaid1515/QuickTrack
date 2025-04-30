import mongoose from "mongoose";

import "@/models/user.model";
import "@/models/product.model";
import "@/models/order.model";

export async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    return connection;
  } catch (error) {
    console.error(error.message);
  }
}
