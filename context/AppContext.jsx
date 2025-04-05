import axios from "axios";
import { createContext, useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.BACKEND_URL || 'http://localhost:4000'
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData,setUserData] = useState(false)

    const getUserData = async () => {
        try {

            const {data} = await axios.get(backendUrl + '/api/user/userData');
            if(data.success){
                setUserData(data.user)
                console.log(data.user)
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
            
        }
    }

    const getAuthState = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if(data.success){
                setIsLoggedin(true);
                console.log(isLoggedin)
                getUserData();
            }
        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
            
        }
    }

    useEffect(()=>{
        getAuthState();
    },[])

    const value = {
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}