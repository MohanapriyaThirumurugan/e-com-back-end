import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
async function connectToDatabase () {
    try {
      await mongoose.connect(process.env.dburl,{
        useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,  // Increase the timeout to 30 seconds
      connectTimeoutMS: 30000,  

      })
      console.log("Database connected");
    } catch (error) {
      console.error("Error connecting to database:", error);
    }
  }
export default connectToDatabase
 
// export{
//   mongoose
// }