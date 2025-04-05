import React, { useContext, useState } from 'react'
import { assets } from '../src/assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

  const navigate = useNavigate()

  const {backendUrl,setIsLoggedin,getUserData} = useContext(AppContext)

  const [state, setState] = useState("Sign Up")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if(state === 'Sign Up'){
        const {data} = await axios.post(backendUrl + '/api/auth/register',{name,email,password})
        if(data.success){
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        }
        else{
          toast.error(data.message)
        }
      }
      else{
        const {data} = await axios.post(backendUrl + '/api/auth/login',{email,password})
        // const {data} = await axios.post(`${backendUrl}/api/auth/login`,{email,password})
        if(data.success){
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        }
        else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div>
      <div>
        <h2>{state === 'Sign Up' ? 'Create Account' : 'Login your Account'}</h2>
        <p>{state === 'Sign Up' ? 'Create your Account' : 'Login your Account'}</p>

        <form onSubmit={submitHandler}>
          {state === 'Sign Up' && (
            <div className='flex items-center gap-1'>
              <img src={assets.person_icon} alt="" />
              <input type="text" placeholder='Full Name' onChange={e => setName(e.target.value)} value={name} required />
            </div>)}


          <div className='flex items-center gap-1'>
            <img src={assets.mail_icon} alt="" />
            <input type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} value={email} required />
          </div>

          <div className='flex items-center gap-1'>
            <img src={assets.lock_icon} alt="" />
            <input type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} value={password} required />
          </div>
          <p className='' onClick={()=>navigate('/reset-password')}>Forgot Password?</p>
          <button>{state === 'Sign Up' ? 'Sign Up' : 'Login'}</button>

        </form>

        {state === 'Sign Up' 
        ? (<p>Already have an account? {' '} <span className='' onClick={()=>setState('Login')}>Login here</span></p>) 
          : (<p>Don't have an account? {' '} <span className='' onClick={()=>setState('Sign Up')}>Signup here</span></p>)}




      </div>
    </div>
  )
}

export default Login