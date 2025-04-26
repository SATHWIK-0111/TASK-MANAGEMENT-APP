const mongoose =require('mongoose')

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGOURI).then(console.log("Database connected"))
        .catch(err=>{console.log("ERROR :",err)})
        
    }
    catch(err){
        console.err(err);
    }
}
