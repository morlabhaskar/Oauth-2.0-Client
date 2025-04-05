import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../src/assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

//for ldrs loader
import { DotWave } from 'ldrs/react'
import 'ldrs/react/DotWave.css'

const EmailVerify = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  axios.defaults.withCredentials = true;
  const {backendUrl,isLoggedin,userData,getUserData} = useContext(AppContext);

  const inputRefs = React.useRef([])

  const handleInput = (e,index) => {
    const value = e.target.value
    if(value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e,index) => {
    const value = e.target.value
    if(e.key === 'Backspace' && index > 0 && value === ""){
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char,index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const otp = inputRefs.current.map(input => input.value).join('')
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp})
      if(data.success){
        setLoading(false)
        toast.success(data.message)
        getUserData()
        navigate('/')
      }
      else{
        setLoading(false)
        toast.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
      console.log(error.message)
    }
  }

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedin,userData])


  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <h1 onClick={() => navigate('/')} className="absolute cursor-pointer top-5 left-8 self-center md:text-3xl text-center text-lg font-semibold whitespace-nowrap bg-gradient-to-br from-blue-600 via-purple-500 to-red-600 bg-clip-text text-transparent mb-2">oAuth</h1>
      <form onSubmit={handleSubmit} className='bg-transparent border-[3px] border-zinc-800 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-zinc-800 text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-700'>Enter the 6-digit code sent to your regiter Email Address.</p>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
        {Array(6).fill(0).map((_,index)=>(
          <input key={index} type="text" 
          className='w-12 h-12 text-white bg-[#333A5C] text-center text-xl rounded-md' 
          maxLength={1} 
          ref={e => inputRefs.current[index] = e}
          onInput = {(e) => handleInput(e,index)}
          onKeyDown = {(e) => handleKeyDown(e,index)}
          />
        ))}
        </div>
        <button className='w-full py-3 bg-gradient-to-br from-blue-600 via-purple-500 to-red-400 text-white rounded-full cursor-pointer'>
          {loading
              ? <DotWave
                size="30"
                speed="2"
                color="white" />
              : "Verify Email"}
        </button>
      </form>
    </div>
  )
}

export default EmailVerify