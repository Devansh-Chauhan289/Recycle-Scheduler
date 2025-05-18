import { Input } from "./input";
import { Button } from "./input";
import { useNavigate } from "react-router";
import { useState } from "react";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export let Signup = () => {
    let [user, setUser] = useState({
        fullname: "",
        email: "",
        address : "",
        phone : "",
        role : "user",
        password: "",
    });
    let [error, setError] = useState("");
    let [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    const handlechange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
        // Clear error when user starts typing
        if (error) setError("");
    };    

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const res = await fetch("http://recycle-server-production.up.railway.app/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                alert(data.msg)
            }
            
            console.log(data);
            
            
            if (data.success) {
                navigate("/login");
            } 
        } catch (error) {
            console.error("Error during signup:", error);
            setError(error.message || "An error occurred during signup");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="w-full h-screen">
            <div className="m-[auto] rounded-xl mt-[10%] p-[3px] bg-gradient-to-r from-[#662d91] to-[#F9629F] w-[40%]">
                <form onSubmit={handleSubmit} className="rounded-xl bg-white   w-full h-[auto] flex flex-col justify-space-around gap-10 px-10 py-10">
                    <h1 className="text-[#1d1160] font-serif text-[300%] text-center font-semibold"
                    >
                    Sign up to Start </h1>
                    <Input placeholder="Enter your full Name" className="text" value={user.fullname} name="fullname" onchange={handlechange} />

                    <Input placeholder="Enter your Email" name="email"className="text" value={user.email} onchange={handlechange} type="email" />

                    <Input placeholder="Enter your Address" name="address"className="text" value={user.address} onchange={handlechange} type="address" />

                    <Input placeholder="Enter your Phone" name="phone" className="text" value={user.phone} onchange={handlechange} type="phone" />

                    <h2>Role : </h2>
                    <div className="bg-[#008080] cursor-pointer text-decoration-none text-white font-semibold flex items-center px-3 justify- text-xl rounded-xl">
                        <select name="role" onSelect={(e) => setUser({...user, role : e.target.value})} className="cursor-pointer bg-[#008080] rounded-xl appearance-none w-full h-full border-none focus:border-none focus:outline-none py-3"
                            >
                            <option value="user">User</option>
                            <option value="vendor">Vendor</option>
                        </select >
                        <span><FontAwesomeIcon icon={faChevronDown} /></span>
                    </div>

                    <Input placeholder="Enter your Password" name="password" className="text" value={user.password} onchange={handlechange} type="password" />
                    <div className="w-full  h-full flex flex-col align-center">
                        <Button type="Submit" loading = {loading} label={loading ? "Signing Up..": "Sign Up"}/>
                        <h1 className="text">Already Registered..? <b onClick={()=> navigate("/login")} className="text-[#191970]  cursor-pointer hover:underline">Then Sign  In</b></h1>
                    </div>
                    
                </form>
            </div>
        
        </div>
        </>
    );
};
