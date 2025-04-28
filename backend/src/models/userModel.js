import mongoose, { model } from "mongoose"
import { Schema } from "mongoose"

const UserSchema = new Schema({
    fullname : {type : String,require:true},
    email : {type : String,require:true},
    role : {type : String,enum : ["user","vendor"],default : "user"},
    address : {type : String,require:true}, 
    password : {type : String,require:true},
    token : {type : String},
    available : {type : Boolean, default : false}
})

const UserModel = model("users",UserSchema)

export {
    UserModel
}