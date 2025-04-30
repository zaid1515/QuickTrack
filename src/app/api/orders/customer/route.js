import { connectDB } from "../../../../lib/db";
import { authGuard } from "../../../../lib/middleware/authGuard";
import Order from "../../../../models/order.model";

export const GET = authGuard(async (req) => {
  try {
    await connectDB();

    if (!req.user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const customerId = req.user.userId;
    const customerOrders = await Order.find({ customer: customerId })
      .populate({ path: "customer", select: "name", model: "User" })
      .populate({ path: "product", select: "name", model: "Product" })
      .populate({ path: "delivery", select: "name", model: "User" }) 
      .sort({ createdAt: -1 })
      .lean();

    if (!customerOrders.length) {
      return Response.json(
        { success: false, message: "No orders found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Orders fetched successfully",
        data: customerOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: error.message, data: [] },
      { status: 500 }
    );
  }
});
