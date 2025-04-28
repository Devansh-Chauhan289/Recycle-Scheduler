import express from "express";
import { UserLogin, UserSignup } from "../controllers/userController.js";


const UserRouter = express.Router()

UserRouter.post("/signup",UserSignup);
UserRouter.post("/login",UserLogin)

export{
    UserRouter
}