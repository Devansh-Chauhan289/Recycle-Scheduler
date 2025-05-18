
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"




export const VendorDashboard = () => {

    const [pickups,setpickups] = useState([])
    const [user,setuser] = useState(() => {
        const stored = localStorage.getItem("user")
        return stored ? JSON.parse(stored) : {}
    })
    const [vendor,setvendi] = useState(null)
    const [model,setmodel] = useState(false)
    const navigate = useNavigate()


    const handleCheck = () => {
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login")
        }
        else if(token && ["/login","/signup"].includes(window.location.pathname)){
            navigate("/")
        }

    }

    const getVendor = async() => {

        const res = await fetch(`http://localhost:5000/user/get`,{
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
            }
        })
        const data = await res.json()
        if(res.status === 200){
            const vendors = data.vendors
            const newvendi = vendors.filter((ven) => ven._id === user._id)
            setvendi(newvendi[0])
        }
    }

    const getPickupList = async() => {

        const res = await fetch("http://localhost:5000/pickup/get",{
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
        })

        const data = await res.json()
        if(res.status === 200){
            
            setpickups(data.pickups)
        }
    }

    const ResPickup = async(pickupId,response) => {
        console.log(response);
        const res = await fetch(`http://localhost:5000/pickup/update/${pickupId}`,{
            method : "PATCH",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            },
            body : JSON.stringify({
                userId : user._id,
                response : response
            })
        })

        const data = await res.json()
        if(res.status === 200){
            getPickupList()
        }
    }

    const ChangeStatus = async(response) => {

        const res = await fetch("http://localhost:5000/user/update",{
            method : "PATCH",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            },
            body : JSON.stringify({
                id : user._id,
                available : response
            })
        })

        const data = await res.json()
        if(res.status === 200){
            alert(data.msg)
            getVendor()
        }
    }

    useEffect(() => {
        getPickupList()
        handleCheck()
        getVendor()
    },[])

    

    return(
        <>
            <div className=" text-white bg-[#1DB954] flex flex-col gap-5 p-10">
                <div className="flex flex-col gap-5">
                    <h1 className="text-4xl text-center font-bold">Vendor Details</h1>
                    <div className="bg-[#006400] text-2xl font-semibold p-4 rounded-lg shadow-md grid grid-cols-2 gap-4 justify-items-center">
                        <h2>Name : {user.fullname} </h2>
                        <h2>Availability : {vendor?.available ? "Available" : "Not Available"} </h2>
                        <h2>Phone : {user.phone}</h2>
                        <h2>Adddress : {user.address}</h2>
                    </div>
                    <h1 className="text-2xl font-bold flex gap-5 align-center items-center">
                        Change your Status if you are available for pickups
                        <button className={`${vendor?.available ? "block" : "none"} hover:bg-[#00674b] bg-[#9ACD32] cursor-pointer rounded-xl p-3`} onClick={() => ChangeStatus(true)}>Make Available</button>
                    </h1>
                    
                </div>
                <div className="border-2 border-green-300 shadow-lg bg-[#228B22] text-white rounded-xl flex flex-col gap-5 p-5 mt-5">
                    
                        <div className="flex justify-between items-center shadow-lg p-3 rounded-lg">
                            <h1 className="text-2xl font-bold">Pickup List</h1>
                            <button className="border-none hover:bg-[#00674b] rounded-xl p-3 text-lg font-semibold bg-[#9ACD32]  cursor-pointer  " onClick={getPickupList}>Refresh Pickups</button>
                        </div>
                        <div className=" overflow-y-scroll h-96 flex flex-col gap-5 p-3">
                        {pickups.length > 0 ?(
                            pickups.map((pickup) => {
                                
                                return(
                                    <div className="shadow-lg rounded-xl border-2 border-green-400 p-3 flex justify-evenly items-center bg-[#00BD55] font-semibold text-xl " key={pickup._id}>
                                        <h2>Pickup ID : {pickup._id}</h2>
                                        <h3 className={`cursor-pointer `} onClick={() => setmodel(model === pickup._id ? null : pickup._id)}>VIEW ITEMS</h3>
                                        <div className={`overflow-y-scroll h-25 absolute ml-40 flex flex-col gap-5 bg-[#228B22] ${model === pickup._id ? "block" : "hidden"} rounded-xl border-2 border-green-400 p-3`}>
                                                {pickup.items.map((item,i) => (
                                                    <div key={i} style={{listStyleType : "none"}}>
                                                        <h3>{item}</h3>
                                                    </div>
                                                ))}
                                            </div>
                                        <h2>Address : {pickup.address}</h2>
                                        
                                        
                                        {pickup.status !== "pending"  ? (
                                            <h2>status : {pickup.status}</h2>
                                            
                                        ) : (
                                            <select className="bg-[#2E8B57] p-3 rounded-xl" onChange={(e) => ResPickup(pickup._id,e.target.value)}>
                                                <option value="pending">Pending</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="accepted">Accepted</option>
                                            </select>
                                        )}
                                        <button onClick={() => ResPickup(pickup._id,"completed")} style={pickup.status === "accepted" ? {display : "block" } : {display : "none"}}>Completed</button>
                                        
                                    </div>
                                )
                            })
                        ) : ("NO Pickups Available")}
                    </div>
                </div>
            </div>
        </>
    )
}