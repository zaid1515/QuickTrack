import { connectDB } from "@/lib/db"
import User from "@/models/user.model"
import bcrypt from 'bcryptjs'

export async function POST(req){
     try {
          await connectDB()
          const {name,email,password,role}=await req.json()
          if(!name || !email || !password || !role){
               return Response.json({success:false,message:"All fields are required.", data:[]},{status:400})
          }
          if(role!=="customer" && role!=="delivery"){
               return Response.json({success:false,message:"Role is invalid",data:role},{status:400})
          }

          const userExists= await User.findOne({email})
          if(userExists){
               return Response.json({success:false,message:"User already exists",data:[]},{status:400})
          }
          const hashedPassword=await bcrypt.hash(password,10)
          const newUser=await User.create({name,email,password:hashedPassword,role})

          return Response.json({success:true,message:"User created successfully",data:newUser},{status:201})
     } catch (error) {
          console.log(error.message)
          return Response.json({success:false,message:error.message,data:[]},{status:500})
     }
}