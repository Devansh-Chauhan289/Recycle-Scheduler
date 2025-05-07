import { useEffect, useState } from "react";
import { useNavigate } from "react-router";


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

    const handleCheck = () => {
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login")
        }
        else if(token && ["/login","/signup"].includes(window.location.pathname)){
            navigate("/")
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


    useEffect(() => {
        getPickupList()
        
    },[])

    useEffect(() => {
        handleCheck()
    })

    return(
        <>
        <h1>User Dashboard</h1> 
        <div style={{display : "flex", justifyContent : "space-between"}}>
            <div style={{border : "2px solid",width : "25%", height : "auto"}}>
                <h2>pickup list</h2>
                <div>
                    {
                        pickups ? (pickups.map((ele) => {
            
                            return(
                               
                                    <div key={ele._id} style={{border : "2px solid", margin : "10px", padding : "10px"}}>
                                        
                                        <h3>{ele.status}</h3>
                                        {ele.items.map((item,i) => (
                                            <div key={i} style={{listStyleType : "none"}}>
                                                <h3>{item}</h3>
                                            </div>
                                        ))}
                                        <h4>Time : {formatdate(ele.time)}</h4>
                                        <button onClick={() => handleDelete(ele._id)}>delete</button>
                                    </div>
                                
                            )
                        })) : ("NO pickups found")
                    }
                </div>
            </div>
            <div style={{border : "2px solid", width : "75%", height : "auto"}}>
                <h2>pickup details</h2>
                <div>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="address" value={pickup.address} onChange={(e) => handlechange(e)}/>
                        <input type="datetime-local" name="time" value={pickup.time} onChange={(e) => handlechange(e)} />
                        <input type="text" name="items" value={item} onChange={(e) => setitem(e.target.value)} />
                        
                        <button onClick={handleAddItem}>Add Item</button>
                        <div>
                            <h3>Items</h3>
                            <ul style={{display : "grid", listStyleType : "none", gridTemplateColumns : "repeat(3,100px)", gap:"10px"}}>
                                {pickup.items.map((ele) => {
                                    return(
                                        <li>{ele}</li>
                                    )
                                })}
                            </ul>
                        </div>
                        <button type="submit">Schedule Recycle</button>
                    </form>
                </div>
            </div>
        </div>  
        
        </>
    )
}