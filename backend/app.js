import express from "express";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import { UserRouter } from "./src/routes/userRoute.js";


dotenv.config();


const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const PORT = process.env.PORT || 5000;

app.use("/user",UserRouter)

app.listen(PORT , () => {
    try {
        mongoose.connect(process.env.DB_URL)
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        return console.log("Error connecting to MongoDB: ", error.message);
    }
    console.log("Server is running on http://localhost:" + PORT);
})