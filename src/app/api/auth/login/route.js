import { signJWT } from   "../../../../lib/auth";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/user.model";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ success: false, message: "All fields are required" },{ status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ success: false, message: "User does not exist" },{ status: 404 });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return Response.json({ success: false, message: "Invalid Credentials" },{ status: 401 });
    }

    const token=signJWT({userId:user._id,role:user.role})
    return Response.json({success:true,message:"Login Succesful",data:token},{status:200})

  } catch (error) {
    console.log({ success: false, message: error.message, data: [] })
    return Response.json(
      { success: false, message: error.message, data: [] },
      { status: 500 }
    );
  }
}
