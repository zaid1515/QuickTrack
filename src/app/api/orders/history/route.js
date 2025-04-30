import { connectDB } from "@/lib/db";
import { authGuard } from "@/lib/middleware/authGuard";
import Order from "@/models/order.model";
import User from "@/models/user.model";

export const GET=authGuard(async(req)=>{
     try {
          await connectDB();
          if(!req.user){
               return Response.json({ success: false, message: "Unauthorized" },{ status: 401 });
          }

          const user=await User.findById(req.user.userId)
          if(!user){
               return Response.json({success:false,message:"User not found"},{status:404})
          }

          let orders;
          // console.log(user)
          if(user.role==="customer"){
               // console.log("user.role",user.role)
               orders=await Order.find({customer:user._id,status:"Delivered"}) 
               .populate({ path: "customer", select: "name", model: "User" })
               .populate({ path: "product", select: "name", model: "Product" })
               .populate({ path: "delivery", select: "name", model: "User" }) 
               .sort({ createdAt: -1 })
               .lean()
          }
          else{
               orders=await Order.find({delivery:user._id,status:"Delivered"})
               .populate({ path: "customer", select: "name", model: "User" })
               .populate({ path: "product", select: "name", model: "Product" })
               .populate({ path: "delivery", select: "name", model: "User" }) 
               .sort({ createdAt: -1 })
               .lean();
          }
          return Response.json({success:true,message:"Orders fetched successfully",data:orders},{status:200})
     } catch (error) {
          console.error(error.message);
          return Response.json(
            { success: false, message: error.message, data: [] },
            { status: 500 }
          );   
     }
})