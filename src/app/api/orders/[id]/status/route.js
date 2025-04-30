import { connectDB } from "@/lib/db";
import { authGuard } from "@/lib/middleware/authGuard";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export const PATCH = authGuard(async (req, contextPromise) => {
  try {
    const context = await contextPromise;
    const params= await context.params
    const orderId = await params.id;

    await connectDB();

    if (!req.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (req.user.role === "customer") {
      return NextResponse.json(
        {
          success: false,
          message: "Customers cannot update orders",
        },
        { status: 403 }
      );
    }

    const { status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID and status are required",
        },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (
      order.deliveryPartnerId &&
      order.deliveryPartnerId.toString() !== req.user.userId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This order does not belong to you",
        },
        { status: 403 }
      );
    }

    order.status = status;
    order.delivery = req.user.userId;
    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated successfully",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { success: false, message: error.message, data: [] },
      { status: 500 }
    );
  }
});
