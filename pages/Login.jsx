import React, { useContext, useState } from 'react'
import { assets } from '../src/assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

//for ldrs loader
import { DotWave } from 'ldrs/react'
import 'ldrs/react/DotWave.css'



const Login = () => {

  const navigate = useNavigate()

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext)

  const [state, setState] = useState("Sign Up")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const [passwordStrength, setPasswordStrength] = useState('')

  const evalPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length <= 3) return "Weak";
    if (password.length <= 5) return "Medium";
    if (password.length >= 6) return "Strong";
  }

  const submitHandler = async (e) => {
    try {

      e.preventDefault();
      setLoading(true)
      axios.defaults.withCredentials = true;
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })
        if (data.success) {
          setIsLoggedin(true)
          setLoading(false)
          toast.success(data.message)
          getUserData()
          navigate('/')
        }
        else {
          toast.error(data.message)
          console.log(data.message)
          setLoading(false)
        }
      }
      else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
        if (data.success) {
          setIsLoggedin(true)
          setLoading(false)
          toast.success(data.message)
          getUserData()
          navigate('/')

        }
        else {
          toast.error(data.message)
          console.log(data.message)
          setLoading(false)
        }
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error.message)
      setLoading(false)
    }
  }

  return (
    <div className='bg-white min-h-[100vh] flex items-center justify-center'>
      <div className='p-4 rounded-xl border-[3px] border-zinc-800 shadow-2xl'>
        <h1 className="self-center md:text-3xl text-center text-lg font-semibold whitespace-nowrap bg-gradient-to-br from-blue-600 via-purple-500 to-red-600 bg-clip-text text-transparent mb-2">oAuth</h1>

        <h2 className='text-2xl font-bold text-teal-700 text-center'>{state === 'Sign Up' ? 'Create Account' : 'Login your Account'}</h2>
        <p className='text-md text-center mb-2'>{state === 'Sign Up' ? 'Create your Account' : 'Login your Account'}</p>

        <form onSubmit={submitHandler}>
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full border-[2px] border-zinc-800'>
              <img src={assets.person_icon} alt="" className='w-3 h-3' />
              <input type="text" className='bg-transparent outline-none text-black' placeholder='Full Name' onChange={e => setName(e.target.value)} value={name} required />
            </div>
          )}


          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full border-[2px] border-zinc-800'>
            <img src={assets.mail_icon} alt="" />
            <input type="email" placeholder='Email' className='bg-transparent outline-none text-black' onChange={e => setEmail(e.target.value)} value={email} required />
          </div>

          <div className='mb-2 flex items-center gap-3 w-full px-5 py-2.5 rounded-full border-[2px] border-zinc-800'>
            <img src={assets.lock_icon} alt="" />
            <input type="password" placeholder='Password' className='bg-transparent outline-none text-black'
              onChange={e => {
                setPassword(e.target.value);
                setPasswordStrength(evalPasswordStrength(e.target.value));
              }}
              value={password}
              required />

          </div>


          <div className='flex justify-between items-center'>
            <p className='text-sm text-red-500 cursor-pointer' onClick={() => navigate('/reset-password')}>Forgot Password?</p>
            {password && (
              <p className={`text-sm ${passwordStrength === 'Weak' ? 'text-red-500' :
                passwordStrength === 'Medium' ? 'text-yellow-400' :
                  'text-green-500'
                }`}>
                {passwordStrength}
              </p>
            )}
          </div>

          <button className='text-ms text-center w-full bg-teal-800 text-white py-2 my-2 rounded-full cursor-pointer hover:scale-105 transition-all duration-400'>
            {loading
              ? <p className='flex items-center gap-2 justify-center'><span>Loading</span>
                <DotWave
                  size="30"
                  speed="2"
                  color="white" />
              </p>
              : state === 'Sign Up' ? 'Sign Up' : 'Login'}
          </button>

        </form>

        {state === 'Sign Up'
          ? (<p className='text-sm text-center'>Already have an account? {' '} <span className='text-blue-700 cursor-pointer' onClick={() => setState('Login')}>Login here</span></p>)
          : (<p className='text-sm text-center' >Don't have an account? {' '} <span className='text-blue-700 cursor-pointer' onClick={() => setState('Sign Up')}>Signup here</span></p>)}




      </div>
    </div>
  )
}

export default Login