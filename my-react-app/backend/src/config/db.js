const mongoose=require("mongoose");

const connectDB=async()=>{
    try{
        console.log("Attempting MongoDB connection...");

        await mongoose.connect(process.env.MONGO_URI, { family: 4 });

        console.log("MongoDB Connected");
    }
    catch(error){
        console.error("FULL ERROR:");
        console.error(error);

        process.exit(1);
    }
};

module.exports=connectDB;