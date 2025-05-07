import { useEffect, useState } from "react"
import { useNavigate } from "react-router"



export const VendorDashboard = () => {

    const [pickups,setpickups] = useState([])
    const [user,setuser] = useState(() => {
        const stored = localStorage.getItem("user")
        return stored ? JSON.parse(stored) : {}
    })
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

    useEffect(() => {
        getPickupList()
        handleCheck()
        console.log(user);
    },[])

    return(
        <>
            <div>
                <div>
                    <h1>Vendor Details</h1>
                    <div>
                        <h2>Name : {user.fullname} </h2>
                        <h2>Availability : {user.available ? "Available" : "Not Available"} </h2>
                        <h2>Phone : </h2>
                    </div>
                </div>
                <div>
                    <h1>Pickup List</h1>
                    <div>
                        {pickups.length > 0 ?(
                            pickups.map((pickup) => {
                                
                                return(
                                    <div style={{border : "1px solid black", margin : "10px", padding : "10px"}} key={pickup._id}>
                                        <h2>Pickup ID : {pickup._id}</h2>
                                        <h2>Address : {pickup.address}</h2>
                                        {pickup.status !== "pending"  ? (
                                            <h2>status : {pickup.status}</h2>
                                        ) : (
                                            <select onChange={(e) => ResPickup(pickup._id,e.target.value)}>
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