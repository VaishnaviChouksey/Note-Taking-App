const mongoose= require('mongoose');
const mongoURI="MongoDB URI"
// const connectToMongo=()=>{
//     mongoose.connect(mongoURI,()=>{
//         console.log("Connected to mongo Successfully");
//     })
// }
const connectToMongo = async () => {
    try {
   //  mongoose.set("strictQuery", false);
    await mongoose.connect(mongoURI);
      console.log("Connected to Mongo Successfully!");
    } catch (error) {
      console.log(error);
    }
  };

module.exports=connectToMongo; 
