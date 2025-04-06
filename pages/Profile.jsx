import React, { useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext';
import { CheckCircle, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
  const { userData, backendUrl } = useContext(AppContext)

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

    return (

        <div className="min-h-screen bg-[linear-gradient(to_bottom_right,_#f1f5f9,_#f3eaba,_#eaafd0,_#d8b4fe)] flex items-center justify-center p-4">
            <h1 onClick={() => navigate('/')} className="absolute cursor-pointer top-5 left-8 self-center md:text-3xl text-center text-lg font-semibold whitespace-nowrap bg-gradient-to-br from-blue-600 via-purple-500 to-red-600 bg-clip-text text-transparent mb-2">oAuth</h1>
            <div className="relative bg-white dark:bg-zinc-900 border-4 border-transparent rounded-3xl p-6 w-full max-w-sm shadow-2xl group hover:border-blue-500 transition-all duration-300 ease-in-out">
                {/* Verified icon top-right */}
                <div className="absolute top-5 right-5">
                    {userData.isAccountVerified && (
                        <CheckCircle className="text-green-500 animate-pulse" size={28} />
                    )}
                </div>

                {/* Avatar & Name */}
                <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-tr from-indigo-500 to-blue-500 p-[2px] rounded-full">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0D8ABC&color=fff`}
                            alt="profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                        />
                    </div>

                    <h2 className="mt-4 text-2xl font-bold text-zinc-800 dark:text-white">
                        {userData.name}
                    </h2>

                    <p className="text-sm text-zinc-500 dark:text-zinc-300 flex items-center justify-center gap-1">
                        <Mail size={16} className="text-blue-500" />
                        {userData.email}
                    </p>

                    <span className={`text-xs mt-2 px-3 py-1 rounded-full font-medium shadow-sm ${
                        userData.isAccountVerified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}>
                        {userData.isAccountVerified ? <p>Verified Account</p> : <p className='cursor-pointer' onClick={sendVerificationOtp}>Unverified Account</p>}
                    </span>
                </div>

                {/* Date Info */}
                <div className="mt-6 border-t pt-4 text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                    <p className="flex items-center gap-2">
                        <Calendar size={16} className="text-purple-500" />
                        <strong>Joined:</strong> {new Date(userData.createdAt).toLocaleString()}
                    </p>
                    <p className="flex items-center gap-2">
                        <Calendar size={16} className="text-pink-500" />
                        <strong>Last Updated:</strong> {new Date(userData.updatedAt).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Profile