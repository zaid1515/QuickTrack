import { connectDB } from "@/lib/db";
import { authGuard } from "@/lib/middleware/authGuard";
import Order from "@/models/order.model";
import Product from "@/models/product.model";

// creating a new order, route: /api/orders
export const POST = authGuard(async (req) => {
  try {
    await connectDB();

    if (!req.user) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const customerId = req.user.userId;

    const { productId, quantity, location } = await req.json();
    if (!productId || !quantity || !location) {
      return Response.json({ success: false, message: "All fields required" }, { status: 400 });
    }

    const product = await Product.findById(productId);  
    if (!product) {
      return Response.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    if (product.quantity < quantity) {
      return Response.json({ success: false, message: `Only ${product.quantity} items left. Please update your order.` },{ status: 409 });
    }

    const newOrder = await Order.create({
      customer: customerId,
      product: product._id,
      location: location,
      quantity: quantity,
    });

    product.quantity -= quantity;
    await product.save();

    return Response.json({ success: true, message: "Order placed successfully", data: newOrder },{ status: 201 });
  } catch (error) {
    console.error(error.message);
    return Response.json(
      { success: false, message: error.message, data: [] },
      { status: 500 }
    );
  }
})