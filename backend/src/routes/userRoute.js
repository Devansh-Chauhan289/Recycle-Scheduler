import express from "express";
import { Getvendor, UpdateVendor, UserLogin, UserSignup } from "../controllers/userController.js";


const UserRouter = express.Router()

UserRouter.post("/signup",UserSignup);
UserRouter.post("/login",UserLogin);
UserRouter.patch("/update",UpdateVendor);
UserRouter.get("/get",Getvendor);


export{
    UserRouter
}