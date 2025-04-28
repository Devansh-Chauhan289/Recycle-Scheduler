import { populate } from "dotenv";
import mongoose, { model, Schema } from "mongoose";


const PickupSchema = new Schema({
    userId : {type : String,require:true,unique:true,populate : "users"},
    vendorId : {type : String,require:true,unique:true,populate : "users"},
    address : {type : String,require :true},
    time : {type : String,require:true},
    status : {type : String,default : "pending"}
})

const PickupModel = model("pickups",PickupSchema)

export {
    PickupModel
}