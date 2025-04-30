import { useState } from "react"


export const Signup = () => {

    const [user,setuser] = useState({
        fullname : "",
        address : "",
        email : "",
        password : ""
    })

    const handlechange = (e) =>{
        const {name,value} = e.target
        setuser({
            ...user,
            [name] : value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        const res = await fetch("http://localhost:5000/user/signup",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(user)
        })

        const data = await res.json()
        console.log(data);
        setuser({
            email : "",
            password : "",
            fullname : "",
            address : ""
        })
    }


    return(
        <>
        <form onSubmit={handleSubmit}>
            <input type="text" name="fullname" value={user.fullname} onChange={(e) => handlechange(e)} placeholder="Enter your Full Name" />
            <input type="email" name="email" value={user.email} onChange={(e) => handlechange(e)} placeholder="Enter your Email" />
            <input type="password" name="password" value={user.password} onChange={(e) =>  handlechange(e)} placeholder="Enter Your Password" />
            <input type="text" name="address" value={user.address} onChange={(e) => handlechange(e)} placeholder="Enter Address" />
            <button type="submit">Submit</button>
        </form>
        </>
    )
}