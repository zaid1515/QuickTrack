import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { authGuard } from "@/lib/middleware/authGuard";

export const GET = authGuard(async (req) => {
  try {
    await connectDB();

    if (!req.user) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return Response.json(
        { success: false, message: "User does not exist" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "User fetched successfully", data: user },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: error.message, data: [] },
      { status: 500 }
    );
  }
});
