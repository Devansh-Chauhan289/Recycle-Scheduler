import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {faTrash} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const User = () => {

    const [pickups,setpickups] = useState([])
    const [user,setuser] = useState(() => {
        const stored = localStorage.getItem("user")
        return stored ? JSON.parse(stored) : {}
    })
    const navigate = useNavigate()
    const [item,setitem] = useState("")
    const [pickup,setpickup] = useState({
        userId : user._id,
        address : user.address,
        time : "",
        items : []
    })
    const [model,setmodel] = useState(false)

    const handleCheck = () => {
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login")
        }
        else if(token && ["/login","/signup"].includes(window.location.pathname)){
            navigate("/")
        }
        else if(token && user.role === "vendor"){
            navigate("/vendor")

        }

    }

    const formatdate = (isoDateString) => {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
      };

    const getPickupList = async() => {

        const res = await fetch("http://recycle-server-production.up.railway.app/pickup/get",{
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
        })

        const data = await res.json()
        if(res.status === 200){
            const picks = data.pickups
            const newpicks = picks.filter((ele) => ele.userId === user._id)
            setpickups(newpicks)
        }
    }

    const handleAddItem = (e) => {
        e.preventDefault()
        if(item){
            setpickup({
                ...pickup,
                items : [...pickup.items,item]
            })
            setitem("")
        }
    }

    const handlechange = (e) => {

        const {name, value} = e.target
        setpickup({
            ...pickup,
            [name] : value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log(user);
        console.log(pickup);
        const res = await fetch("http://localhost:5000/pickup/schedule",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                // "Authorization" : `Bearer ${localStorage.getItem("token")}`
            },
            body : JSON.stringify(pickup)
        })

        const  data = await res.json();
        if(res.status === 201){
            console.log(data.msg);
            getPickupList()
            setpickup({
                ...pickup,
                time : "",
                address : user.address,
                items : []
            })
        }
    }

    const handleDelete = async(id) => {
        const res = await fetch(`http://localhost:5000/pickup/cancel/${id}`,{
            method : "DELETE",
            headers : {
                "Content-Type" : "application/json",
                // "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
        })

        const data = await res.json()
        if(res.status === 200){
            console.log(data.msg);
            getPickupList()
        }
    }

    const HandleRemoveItems = (i) => {

        setpickup({
            ...pickup,
            items : pickup.items.filter((ele,index) => index !== i)
        })
    }


    useEffect(() => {
        getPickupList()
        
    },[])

    useEffect(() => {
        handleCheck()
    })

    return(
        
        <div className="p-10 flex flex-col text-white bg-[#1DB954] gap-5">
            <h1 className="text-4xl text-center font-bold">User Dashboard</h1> 
            <div className="bg-[#006400] text-2xl font-semibold  p-4 rounded-lg shadow-md grid grid-cols-2 gap-4 justify-items-center">
                <h1> <b>Name :</b> {user.fullname}</h1>
                <h1> <b>Address :</b> {user.address}</h1>
                <h1><b>Phone : </b>{user.phone}</h1>
            </div>
            <div className="flex flex-col gap-5 ">
                <div className="bg-[#008000] font-semibold py-5 " >
                    <h2 className="text-2xl font-bold text-center">Pickup Details</h2>
                    
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-xl justify-items-center">
                            <label className="flex gap-3 align-center items-center font-semibold text-xl" > Address : 
                                <input
                                    className="border-2 border-gray-300 rounded-md p-2 font-normal"
                                    type="text" 
                                    placeholder="Address" 
                                    name="address" 
                                    value={pickup.address} 
                                    onChange={(e) => handlechange(e)}/>
                            </label> 
                            <label className="flex gap-3 align-center items-center font-semibold text-xl">Date of Pickup : 
                                <input 
                                    className="border-2 border-gray-300 rounded-md p-2 font-normal "
                                    type="datetime-local" 
                                    name="time" 
                                    value={pickup.time} 
                                    onChange={(e) => handlechange(e)} />
                            </label>
                            <label className="flex gap-3 align-center items-center font-semibold text-xl">Items :
                                <input 
                                    placeholder="Item for Recycle"
                                    className="border-2 border-gray-300 rounded-md p-2 font-normal"
                                    type="text" 
                                    name="items" 
                                    value={item} 
                                    onChange={(e) => setitem(e.target.value)} />
                            </label>
                            <button className="border rounded-xl p-3" onClick={handleAddItem}>Add Item</button>
                            <div>
                                <h3 className="text-2xl">Items : </h3>
                                <ul className={`list-disc grid grid-cols-3 gap-x-4 justify-items-center ${pickup.items.length > 0 ?"overflow-y-scroll h-25" : "" } border-2 border-gray-300 rounded-md px-5 custom-scrollbar`}>
                                    {pickup.items.map((ele,index) => {
                                        return(
                                            <>
                                            <li className="text-xl m-3">{ele} <FontAwesomeIcon onClick={() => HandleRemoveItems(index)} icon={faTrash} className="cursor-pointer hover:text-red-400" /></li>
                                            
                                            </>
                                            
                                            
                                        )
                                    })}
                                </ul>
                            </div>
                            <button className="cursor-pointer hover:bg-[#00674b] bg-[#9ACD32] cursor-pointer rounded-xl p-3 m-10" type="submit">Schedule Recycle</button>
                        </form>
                    
                </div>
                <div className="border-2 border-green-400 p-5 flex flex-col gap-5 bg-[#228B22] rounded-xl " >
                    <h2 className="text-2xl font-bold border-none p-3 shadow-lg">Pickup List</h2> 
                    <div className="overflow-y-scroll h-96 flex flex-col gap-5 p-3" >
                        {
                            pickups ? (pickups.map((ele) => {
                
                                return(
                                
                                        <div key={ele._id} className="shadow-lg rounded-xl border-2 border-green-400 p-3 flex justify-evenly items-center bg-[#00BD55] font-semibold text-xl ">
                                            
                                            <h3> STATUS : {ele.status}</h3>
                                            <h3 className={`cursor-pointer `} onClick={() => setmodel(model === ele._id ? null : ele._id)}>VIEW ITEMS</h3>
                                            <div className={`overflow-y-scroll h-25 flex flex-col gap-5 absolute ${model === ele._id ? "block" : "hidden"} bg-[#228B22] rounded-xl border-2 border-green-400 p-3`}>
                                                {ele.items.map((item,i) => (
                                                    <div key={i} style={{listStyleType : "none"}}>
                                                        <h3>{item}</h3>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <h4>TIME : {formatdate(ele.time)}</h4>
                                            <button className="hover:bg-[#00674b] bg-[#9ACD32] cursor-pointer rounded-xl px-2" onClick={() => handleDelete(ele._id)}>Delete</button>
                                        </div>
                                    
                                )
                            })) : ("NO pickups found")
                        }
                    </div>
                </div>
                
            </div>  
        </div>
        
    )
}
