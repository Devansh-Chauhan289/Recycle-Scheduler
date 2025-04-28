import { UserModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();



const UserSignup = async(req,res) => {
    
    const { fullname,email,password,address,role } = req.body;

    try {
        if(!fullname || !email || !password || !address) {
            return res.status(400).json({
                msg : "Please fill all the fields"
            })
        }
        
        const isExists = await UserModel.findOne({email})
        if(isExists) {
            return res.status(400).json({
                msg : "User already exists"
            })
        }

        const newuser = await UserModel({
            fullname,
            email,
            address,
            role
        })
        bcrypt.hash(password,10,async(err,res)=> {
            if(err){
                console.log("Error Occured",err);
                return res.status(500).json({
                    msg : "Internal Server Error"
                })
            }
            newuser.set("password",res)
            await newuser.save()
        })

        return res.status(200).json({
            success : true,
            msg : "User Created Successfully"
        })
        

    } catch (error) {
        console.log("Error Occured",error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}


const UserLogin = async(req,res) => {

    const {email,password} = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({
                msg : "Please fill all the fields"
            })
        }

        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(404).json({
                msg : "User not found"
            })
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({
                msg : "Invalid Credentials"
            })
        }

        const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn : "1d"})
        user.set("token",token)
        await user.save()
        return res.status(200).json({
            user : user,
            msg : "User Logged In Successfully",
            token : token
        })
    } catch (error) {
        console.log("error occurred",error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}


export{
    UserLogin,
    UserSignup
}