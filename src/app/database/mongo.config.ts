// import { config } from 'dotenv';
// config();
import mongoose from 'mongoose'

export const connect = async () =>  {
    await mongoose .connect(process.env.MONGO_URL! , {
        tls:true,
        dbName:"docChatDB"
         //TLS stands for "Transport Layer Security," which is a protocol that encrypts data sent between your application and the MongoDB server 
        //instruct the MongoDB driver (in this case, Mongoose) to use a secure, encrypted connection when communicating with the database.
    },)
    .then( () => console.log("Database Connected Successfully !"))
    .catch((err) => console.log("Some Error Happen !"))
}