import { authGuard } from "@/lib/middleware/authGuard";
import Product from "@/models/product.model";

export const GET=authGuard(async(req)=>{
     try {
          if(!req.user){
               return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
          }

          const products=await Product.find({quantity:{$gte:0}})
          if(!products){
               return Response.json({success:false,message:"No products found",data:[]},{status:404})
          }

          return Response.json({success:true,message:"Fetched Products Successfully",data:products},{status:200})
     } catch (error) {
          console.error(error.message);
          return Response.json(
            { success: false, message: error.message, data: [] },
            { status: 500 }
          );
     }
})