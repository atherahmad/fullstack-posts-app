import mongoose from "mongoose";

const connectDB = async () => {
    
    const MONGO_URI = process.env.MONGO_URI

    try{
        await mongoose.connect(MONGO_URI)
        console.log("DB connected")
    }
    catch(err){
        console.log(err.message)
    }
}
export default connectDB;