import React, { useContext, useState } from 'react'
import { assets } from '../src/assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

//for ldrs loader
import { DotWave } from 'ldrs/react'
import 'ldrs/react/DotWave.css'

const ResetPassword = () => {

  const { backendUrl } = useContext(AppContext)
  axios.defaults.withCredentials = true;

  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(0)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)

   const [passwordStrength, setPasswordStrength] = useState('')
  
    const evalPasswordStrength = (password) => {
      if (password.length === 0) return "";
      if (password.length <= 3) return "Weak";
      if (password.length <= 5) return "Medium";
      if (password.length >= 6) return "Strong";
    }

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    const value = e.target.value
    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    const value = e.target.value
    if (e.key === 'Backspace' && index > 0 && value === "") {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      if (data.success) {
        setLoading(false)
        toast.success(data.message);
        setIsEmailSent(true);
      }
      else {
        toast.error(data.message)
        setLoading(false)
      }

    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.message)


    }
  }

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    // setLoading(true)
    const otpArray = inputRefs.current.map(e => e.value).join('')
    setOtp(otpArray);
    setIsOtpSent(true);
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {

      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword });
      if (data.success) {
        setLoading(false)
        toast.success(data.message);

        navigate('/login')
        console.log(newPassword)
      }
      else {
        setLoading(false)
        toast.error(data.message)
        console.log(newPassword)
      }

    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error(error.message)
      console.log(newPassword)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 via-blue-300 to-purple-500'>
      <h1 onClick={() => navigate('/')} className="absolute cursor-pointer top-5 left-8 self-center md:text-3xl text-center text-lg font-semibold whitespace-nowrap bg-gradient-to-br from-blue-600 via-purple-500 to-red-600 bg-clip-text text-transparent mb-2">oAuth</h1>
      {/* form for enter register email to send otp */}

      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-transparent border-[3px] border-zinc-800 shadow-2xl p-8 rounded-2xl w-96 text-sm'>
          <h1 className='text-zinc-800 text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-800'>Enter your registered email address</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full border-[2px] border-zinc-800 bg-white'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3' />
            <input type="email" placeholder='Email'
              className='bg-transparent outline-none text-black'
              value={email}
              onChange={e => setEmail(e.target.value)} required
            />
          </div>
          <button className='w-full py-3 bg-gradient-to-br from-blue-600 via-purple-500 to-red-400 text-white rounded-full cursor-pointer hover:scale-105 transition-all duration-300'>
            {loading
              ? <DotWave
                size="30"
                speed="2"
                color="white" />
              : "Submit"}
          </button>
        </form>
      }
      {/* form for enter otp to reset password */}

      {isEmailSent && !isOtpSent &&
        <form onSubmit={onSubmitOTP} className='bg-transparent border-[3px] border-zinc-800 p-8 rounded-2xl shadow-lg w-96 text-sm'>
          <h1 className='text-zinc-800 text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-800'>Enter the 6-digit code sent to your regiter Email Address.</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input key={index} type="text"
                className='w-12 h-12 text-black bg-[#e9ebf4] text-center text-xl rounded-md border border-gray-300 focus:outline focus:outline-2 focus:outline-blue-500'
                maxLength={1}
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button className='w-full py-2.5 bg-gradient-to-br from-blue-600 via-purple-500 to-red-400 text-white rounded-full cursor-pointer hover:scale-105 transition-all duration-300'>
            {loading
              ? <DotWave
                size="30"
                speed="2"
                color="white" />
              : "Submit"}
          </button>
        </form>
      }
      {/* form for enter new password */}

      {isEmailSent && isOtpSent &&
        <form onSubmit={onSubmitNewPassword} className='bg-transparent border-[3px] border-zinc-800 p-8 rounded-2xl shadow-lg w-96 text-sm'>
          <h1 className='text-zinc-800 text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-700'>Enter new password below</p>
          <div className='mb-2 flex items-center gap-3 w-full px-5 py-2.5 bg-white rounded-full border-[2px] border-zinc-800'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3' />
            <input type="password" placeholder='New Password'
              className='bg-transparent outline-none w-full text-black'
              value={newPassword}
              onChange={e => {
                setNewPassword(e.target.value);
                setPasswordStrength(evalPasswordStrength(e.target.value));
              }} required
            />
          </div>
          
          {newPassword && (
              <p className={`text-sm mb-3 px-4  ${passwordStrength === 'Weak' ? 'text-red-500' :
                passwordStrength === 'Medium' ? 'text-yellow-600' :
                  'text-green-700'
                }`}>
                {passwordStrength}
              </p>
            )}

          <button className='w-full py-3 bg-gradient-to-br from-blue-600 via-purple-500 to-red-400 text-white rounded-full cursor-pointer hover:scale-105 transition-all duration-300'>
            {loading
              ? <DotWave
                size="30"
                speed="2"
                color="white" />
              : "Submit"}
          </button>
        </form>
      }
    </div>
  )
}

export default ResetPassword