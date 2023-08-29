const mongoose = require("mongoose");
const dBconnect = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("Db Connected Successfully")
    } catch (error) {
        console.log("DB connection issue");
        console.log(error)
        process.exit(1);
    }
}
module.exports = dBconnect;
