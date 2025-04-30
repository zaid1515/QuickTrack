import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  delivery:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"User"
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Out for Delivery", "Delivered"],
    default: "Pending",
  },
  location:{
    type:String,
    required:true
  }
},{timestamps:true});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
