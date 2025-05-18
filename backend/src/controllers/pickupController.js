import { PickupModel } from "../models/pickupModel.js";
import { UserModel } from "../models/userModel.js";



const Pickup = async(req,res) => {
    const {userId, time, address,items} = req.body;
    try {
        if (!userId || !time || !address || !items) {
            return res.status(400).json({
                msg : "Please fill all the fields"
            })
        }

        const freeVendor = await UserModel.findOne({role : "vendor",available : true})
        if(!freeVendor) {
            const newPickup = await PickupModel({
                userId,
                vendorId : null,
                time,
                address,
                items
            })
            await newPickup.save()
            return res.status(201).json({
                msg : "Pickup Created Successfully",
                vendorId : "Not available"
            })
        }
        const newPickup = await PickupModel({
            userId,
            vendorId : freeVendor._id,
            time,
            address,
            items,
            status : "accepted"
        })

        const updatedVendor = await UserModel.findByIdAndUpdate(freeVendor._id,{available : false})

        await newPickup.save()
        return res.status(201).json({
            msg : "Pickup Created Successfully",
            vendorId : freeVendor._id
        })
    } catch (error) {
        console.log("error occurred",error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}


const Getpickup = async(req,res) => {
    // const {userId} = req.params;
    // if (!userId) {
    //     return res.status(400).json({
    //         msg : "Please provide userId"
    //     })
    // }
    try {
        const pickups = await PickupModel.find({}).populate("userId").populate("vendorId")
        if (!pickups) {
            return res.status(404).json({
                msg : "No pickups found"
            })
        }
        return res.status(200).json({msg : "fetch successfully", pickups})
    } catch (error) {
        console.log("error occurred",error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}

const UpdatePickup = async(req,res) => {

    const {pickupId} = req.params;
    const {userId,response} = req.body;
    try {
        const UpdatePickup = await PickupModel.findByIdAndUpdate(pickupId,{vendorId : userId, status : response})
        if (!UpdatePickup) {
            return res.status(404).json({
                msg : "No pickups found"
            })
        }

        return res.status(200).json({
            msg : "Pickup updated successfully"
        })
    } catch (error) {
        console.log("error occurred",error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}

const DeletePickup = async(req,res) => {
    const {pickupId} = req.params;

    try {
        await PickupModel.findByIdAndDelete(pickupId)
        return res.status(200).json({
            msg : "Pickup Cancelled Successfully"
        })

    } catch (error) {
        console.log("error occurred",error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}

export {
    Pickup,
    UpdatePickup,
    Getpickup,
    DeletePickup
}