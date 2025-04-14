import React, { useContext, useEffect } from 'react'
// import { assets } from '../src/assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoIosArrowDown } from "react-icons/io";
import { CheckCircle } from 'lucide-react';
import { CiLogin } from "react-icons/ci";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin,getUserData } = useContext(AppContext)

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')
      if (data.success) {
        navigate('/email-verify')
        toast.success(data.message)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
    }
  }

  const logoutHandler = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      if (data.success) {
        setIsLoggedin(false)
        setUserData(null)
        navigate('/login')
      }
    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
    }
  }

  // useEffect(() => {
  //   getUserData()
  // },[])



  return (
    <div className='flex justify-between items-center py-4 px-8 border-b-[3px] border-black'>
      <h1 className="self-center md:text-2xl text-lg font-semibold whitespace-nowrap bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">oAuth</h1>
      {userData
        ? <div className='flex items-center gap-1 cursor-pointer'>
          <div className='bg-slate-800 text-white font-bold py-1 px-2.5 rounded-full relative group'>
            {userData.name[0].toUpperCase()}
            <div className='absolute flex-col text-black font-medium text-md min-w-[140px] hidden group-hover:block top-0 -right-8 z-10 rounded pt-14'>
              <ul className='bg-slate-300 rounded-md flex flex-col gap-1 justify-center'>
              <li className='cursor-pointer hover:bg-slate-400 px-3 py-1 rounded-tl-md rounded-tr-md' onClick={() => navigate('/profile')}>Profile</li>
                {userData.isAccountVerified ? <li className='px-3 py-1 flex items-center justify-between'><span>Verified</span> <CheckCircle className="text-green-700 font-bold animate-pulse" size={20} /></li> : <li onClick={sendVerificationOtp} className='cursor-pointer hover:bg-slate-400 px-3 py-1 '>Verify Email</li>}
                <li className='cursor-pointer hover:bg-slate-400 px-3 py-1' onClick={() => navigate('/reset-password')}>Reset Password</li>
                <li className='cursor-pointer hover:bg-slate-400 px-3 py-1 rounded-bl-md rounded-br-md' onClick={logoutHandler}>Logout</li>
              </ul>
            </div>

          </div>
          <IoIosArrowDown className='font-bold' />
        </div>
        : <button onClick={() => navigate('/login')} className='cursor-pointer flex items-center gap-1 border-black border-[1px] px-4 py-1 rounded-full hover:bg-slate-200 hover:scale-105 transition-all duration-300'><span>Login</span><CiLogin className='text-black font-bold'/></button>
      }
    </div>
  )
}

export default Navbar

// hidden group-hover:block