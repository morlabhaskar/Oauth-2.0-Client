import React, { useContext } from 'react'
import { assets } from '../src/assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData,backendUrl,setUserData,setIsLoggedin } = useContext(AppContext)

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')
      if(data.success){
        navigate('/email-verify')
        toast.success(data.message)
      }
      else{
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
      const {data} = await axios.post(backendUrl + '/api/auth/logout')
      if(data.success){
        setIsLoggedin(false)
        setUserData(null)
        navigate('/login')
      }
    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
    }
  }

  

  return (
    <div className='bg-red-200 flex justify-between items-center p-4'>
      <img src={assets.logo} alt="" className='w-2xl sm:w-14' />
      {userData 
      ?<div className='border-[1px] border-black py-2 px-4 rounded-full relative group'>
        {userData.name[0].toUpperCase()}
        <div className='absolute flex-col min-w-[100px] hidden group-hover:block top-0 right-0 z-10 rounded pt-14'>
          <ul className='bg-white'>
            {userData.isAccountVerified ? <li>Email Verified</li> : <li onClick={sendVerificationOtp} className='cursor-pointer'>Verify Email</li>}
            {/* {!userData.isAccountVerified && <li onClick={sendVerificationOtp}>Verify Email</li>} */}
            
            <li className='cursor-pointer' onClick={logoutHandler}>Logout</li>
          </ul>
        </div>
      </div>
      :<button onClick={() => navigate('/login')} className='cursor-pointer'>Login</button>
      }
    </div>
  )
}

export default Navbar