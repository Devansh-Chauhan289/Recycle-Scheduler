import { useEffect, useState } from "react"
import { useNavigate } from "react-router"


export const Login = () => {

    const [user,setuser] = useState({
        email : "",
        password : ""
    })
    const navigate = useNavigate()

    const handleCheck = () => {
        const token = localStorage.getItem("token");
        if(token){
            navigate("/")
        }

    }

    const handlechange = (e) =>{
        const {name,value} = e.target
        setuser({
            ...user,
            [name] : value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        const res = await fetch("http://localhost:5000/user/login",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(user)
        })

        const data = await res.json()
        if(res.status === 200 ){
            localStorage.setItem("token",data.token)
            localStorage.setItem("user",JSON.stringify(data.user))
            console.log(data.user);
            console.log(data);
        }
        
        setuser({
            email : "",
            password : ""
        })
    }


    useEffect(() => {
        handleCheck()
    })


    return(
        <>
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" value={user.email} onChange={(e) => handlechange(e)} placeholder="Enter your Email" />
            <input type="password" name="password" value={user.password} onChange={(e) =>  handlechange(e)} placeholder="Enter Your Password" />
            <button type="submit">Submit</button>
        </form>
        </>
    )
}