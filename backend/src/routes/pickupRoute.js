import express from "express";
import { DeletePickup, Getpickup, Pickup, UpdatePickup } from "../controllers/pickupController.js";


const PickupRouter = express.Router();

PickupRouter.post("/schedule",Pickup);
PickupRouter.get("/get",Getpickup);
PickupRouter.put("/update/:pickupId",UpdatePickup)
PickupRouter.delete("/cancel/:pickupId",DeletePickup)


export{
    PickupRouter
}