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

    const pendingOrders = await Order.find({ status: "Pending" })
      .populate({ path: "customer", select: "name", model: "User" })
      .populate({ path: "product", select: "name", model: "Product" })
      .populate({ path: "delivery", select: "name", model: "User" })
      .sort({ createdAt: -1 })
      .lean();
    if (!pendingOrders || pendingOrders.length === 0) {
      return Response.json({ success: false, message: "No pending orders" });
    }

    return Response.json({
      success: true,
      message: "Pending orders fetched successfully",
      data: pendingOrders,
    });
  } catch (error) {
    console.error(error.message);
    return Response.json(
      { success: false, message: error.message, data: [] },
      { status: 500 }
    );
  }
});
