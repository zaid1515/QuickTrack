const mongoose=require('mongoose')

const connectDB=async()=> {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    return connection;
  } catch (error) {
    console.error(error.message);
  }
}

module.exports={connectDB}