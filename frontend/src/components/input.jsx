
import { MoonLoader } from "react-spinners"

export let Input = ({
    placeholder = "",
    type = "text",
    label = "",
    name = "",
    isRequired = false,
    className = "",
    value = "",
    onchange = () => {}

}) => {

    

    return (
        <>
        <div className = "h-[50%] w-[100%]">
            <label htmlFor = {name} className="">
                {label}
            </label>

            <input
             type={type} placeholder={placeholder} required = {isRequired}
             name={name} id={name}
             className={` border-2 border-gray-300 rounded-md p-2 w-full p-2.5 focus:border-red-400 focus:ring-blue-500 block ${className}`}
            value={value} onChange={onchange}
            />
        </div>
        </>
    )
}


export const Button = ({
    label = "Button",
    type = "Button",
    className = "",
    loading = false,
    disabled = false
}) => {
    return(
        <>
        <button  className={`cursor-pointer text-white bg-gradient-to-r from-[#800080] to-[#FF00FF] hover:from-[#DDA0DD] hover:to-[#FF00FF] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex justify-center align-center items-center gap-5 ${className}`}
        type={type} disabled = {disabled} loading = {loading}
        >
            {loading ? (<MoonLoader color="black" secondaryColor="white" size="30"/>):("")}
            {label}
        </button>
        </>
    )
}