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

    const deliveryId = req.user.userId;
    console.log(deliveryId)
    const acceptedOrders = await Order.find({delivery:deliveryId})
    .populate({ path: "customer", select: "name", model: "User" })
    .populate({ path: "product", select: "name", model: "Product" })
    .populate({ path: "delivery", select: "name", model: "User" }) 
    .sort({ createdAt: -1 })
    .lean();
    
    if (!acceptedOrders || acceptedOrders.length === 0) {
      return Response.json(
        { success: false, message: "No orders found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Orders fetched successfully",
        data: acceptedOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error.message);
    return Response.json(
      { success: false, message: error.message, data: [] },
      { status: 500 }
    );
  }
});
