import { PickupModel } from "../models/pickupModel";
import { UserModel } from "../models/userModel";



const Pickup = async(req,res) => {
    const {userId, time, address} = req.body;
    try {
        if (!userId || !time || !address) {
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
                address
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
            address
        })

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