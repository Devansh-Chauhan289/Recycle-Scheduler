import { populate } from "dotenv";
import mongoose, { model, Schema } from "mongoose";


const PickupSchema = new Schema({
    userId : {type : String,require:true,populate : "users"},
    vendorId : {type : String,require:true,populate : "users"},
    address : {type : String,require :true},
    time : {type : String,require:true},
    status : {type : String,default : "pending"},
    items : {type : Array,default : []}
})

const PickupModel = model("pickups",PickupSchema)

export {
    PickupModel
}