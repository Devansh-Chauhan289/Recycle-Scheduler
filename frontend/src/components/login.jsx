import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Input,Button } from "./input"


export const Login = () => {

    const [user,setuser] = useState({
        email : "",
        password : ""
    })
    const navigate = useNavigate()
    const [loading,setloading] = useState(false)

    const handleCheck = () => {
        const token = localStorage.getItem("token");
        const user = () => {
            const stored = localStorage.getItem("user")
            return stored ? JSON.parse(stored) : {}

        }
        const userRole = user()
        if(token && userRole.role === "user"){
            navigate("/")
        }
        else if (token && userRole.role === "vendor"){
            navigate("/vendor")
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
        setloading(true)
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
            if(data.user.role === "user"){
                navigate("/")
            } else{
                navigate("/vendor")
            }
        }
        setloading(false)
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
            
            <div className=" w-full h-screen">
            <div className="m-[auto] rounded-xl mt-[10%] p-[3px] bg-gradient-to-r from-[#662d91] to-[#F9629F] w-[40%]">
                <form onSubmit={handleSubmit} className="rounded-xl bg-white  w-full h-[auto] flex flex-col justify-space-around gap-10 px-10 py-10">
                    <h1 className="text-[#1d1160] font-serif text-[300%] text-center font-bold">
                    Already with us..? then Sign In </h1>

                    <Input placeholder="Enter your Email" name="email"className="text" value={user.email} onchange={handlechange} type="email" />

                    <Input
                     placeholder="Enter your Password" 
                     name="password" 
                     className="text" 
                     value={user.password} onchange={handlechange} type="password" />
                    <Button type="Submit" loading = {loading} label={loading ? "Signing In..": "Sign In"} />
                    <h1>Don't Have a account..? <b onClick={()=> navigate("/signup")} className="text-[#191970] hover:underline cursor-pointer">SIGN UP</b></h1>
                </form>
            </div>
        </div>
            </>
        )
}
