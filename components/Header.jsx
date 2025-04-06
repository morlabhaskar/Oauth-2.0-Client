import React, { useContext } from 'react'
import { assets } from '../src/assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate()
  return (
    // <div className='min-h-[91vh] flex flex-col items-center bg-gradient-to-br from-slate-100 via-blue-300 to-purple-300'>
    <div className='min-h-[91vh] flex flex-col items-center bg-[linear-gradient(to_bottom_right,_#f1f5f9,_#a0c7f3,_#eaafd0,_#d8b4fe)]'>
      <div className='flex flex-col justify-center items-center mt-10'>
        <div className='flex flex-col justify-center items-center'>
          <img src={assets.header_img2} alt="" className='w-md' />
          <h1 className='flex gap-2 mt-4'><span>Hey {userData ? userData.name : "Developer"}</span> <img className='w-6' src={assets.hand_wave} alt="" /></h1>
        </div>
        <div className="flex flex-col items-center mt-4 gap-2 ">
          <h1 className='text-xl font-semibold'>Welcome to Our Platform!</h1>
          <p className='text-sm'>Join us today and explore amazing features tailored just for you. Creating an account is easy and takes less than a minute.</p>
          <button onClick={()=>navigate('/login')} className='bg-gradient-to-br from-blue-600 via-purple-500 to-red-600 px-4 py-2 rounded-full text-white mt-4 hover:scale-105 transition-all duration-300 cursor-pointer'>Get Started</button>
        </div>
      </div>
      
    </div>
  )
}

export default Header