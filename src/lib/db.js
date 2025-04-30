import mongoose from "mongoose";

import "../models/user.model";
import "../models/product.model";
import "../models/order.model";

export async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI,{
      serverSelectionTimeoutMS: 30000,  
      connectTimeoutMS: 30000, 
    });
    return connection;
  } catch (error) {
    console.error(error.message);
  }
}
