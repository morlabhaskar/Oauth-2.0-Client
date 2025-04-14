import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext';
import { CheckCircle, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RxCross1 } from "react-icons/rx";
import { assets } from '../src/assets/assets';
import { MdDelete } from "react-icons/md";

//for ldrs loader
import { DotWave } from 'ldrs/react'
import 'ldrs/react/DotWave.css'

const Profile = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, getUserData } = useContext(AppContext)
    const [modelOpen, setModelOpen] = useState(false)
    const [name, setName] = useState(userData.name)
    // const [image, setImage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [delModelOpen, setDelModelOpen] = useState(false)


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

    const updateProfile = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            axios.defaults.withCredentials = true;

            const { data } = await axios.post(backendUrl + '/api/user/update-user', { name });
            if (data.success) {
                toast.success(data.message)
                getUserData()
                setLoading(false)
                setModelOpen(false)
            }
            else {
                toast.error(data.message)
                setLoading(false)
            }


        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
            
        }
    }

    // const updateProfile = async (e) => {
    //     try {
    //         e.preventDefault()
    //         setLoading(true)
    //         axios.defaults.withCredentials = true;

    //         const formData = new FormData()
    //         formData.append('name', name);

    //         if (image) {
    //             formData.append('image', image); // Add the image if available
    //         } else {
    //             console.log("No image selected");
    //         }
    //         // image && formData.append('image', image)

    //         const { data } = await axios.post(backendUrl + '/api/user/update-user', formData);
    //         if (data.success) {
    //             toast.success(data.message)
    //             getUserData()
    //             setLoading(false)
    //             setModelOpen(false)
    //         }
    //         else {
    //             toast.error(data.message)
    //             setLoading(false)
    //         }
    //     } catch (error) {
    //         console.log(error.message)
    //         toast.error(error.message)
    //     }
    // }

    const deleteAccount = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.delete(backendUrl + '/api/user/delete-user')
            if (data.success) {
                toast.success(data.message)
                getUserData();
                navigate('/')
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

        <div className={`min-h-screen bg-[linear-gradient(to_bottom_right,_#f1f5f9,_#f3eaba,_#eaafd0,_#d8b4fe)] flex items-center justify-center p-4 `}>
            <h1 onClick={() => navigate('/')} className="absolute cursor-pointer top-5 left-8 self-center md:text-3xl text-center text-lg font-semibold whitespace-nowrap bg-gradient-to-br from-blue-600 via-purple-500 to-red-600 bg-clip-text text-transparent mb-2">oAuth</h1>
            {modelOpen && (
                <div className="absolute top-1/2 text-black left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[220px] bg-white flex flex-col gap-4 justify-center items-center rounded-lg z-10">
                    <p onClick={() => setModelOpen(!modelOpen)} className='absolute top-2 right-2 cursor-pointer'><RxCross1 className='font-bold text-2xl ' /></p>
                    <form onSubmit={updateProfile} className='flex flex-col gap-4 justify-center items-center'>
                        {/* <label className='flex flex-col'>
                            <div className='cursor-pointer'>
                                <img className='max-w-20 min-w-20 max-h-20 min-h-20 rounded-3xl absolute top-3 left-26 border-2 border-slate-600 opacity-100' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
                            </div>
                            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />
                        </label> */}
                        <div className='flex items-center gap-3 px-5 py-2.5 rounded-full border-[2px] border-zinc-800'>
                            <img src={assets.person_icon} alt="" className='w-3 h-3' />
                            <input type="text" className='bg-transparent outline-none text-black' placeholder='Edit Name' onChange={e => setName(e.target.value)} value={name} required />
                        </div>
                        <button className='text-ms absolute bottom-2 left-2 text-center px-5 bg-teal-800 text-white py-2 my-2 rounded-full cursor-pointer hover:scale-105 transition-all duration-400'>
                            {loading
                                ? <p className='flex items-center gap-2 justify-center'><span>Loading</span>
                                    <DotWave
                                        size="30"
                                        speed="2"
                                        color="white" />
                                </p> : 'Update Name'}
                        </button>
                    </form>
                </div>
            )}

            {delModelOpen && (
                <div className="absolute top-4 text-black py-4 px-2 bg-white flex flex-col justify-center items-center gap-5 rounded-lg z-10">
                    <p>Are you Conform to Delete Parmanantly your Account?</p>
                    <div className='flex gap-3 w-full justify-end px-3'>
                        <button onClick={() => setDelModelOpen(!delModelOpen)} className='border-black border-1 rounded-sm px-2 py-1 text-sm hover:text-white hover:bg-green-500 cursor-pointer hover:border-none'>Cancel</button>
                        <button onClick={deleteAccount} className='border-black border-1 rounded-sm px-2 py-1 text-sm hover:text-white hover:bg-red-600 cursor-pointer hover:border-none'>Delete</button>
                    </div>
                </div>
            )}

            <div className={`relative bg-zinc-900 border-4 border-transparent rounded-3xl p-6 w-full max-w-sm shadow-2xl group hover:border-blue-500 transition-all duration-300 ease-in-out ${modelOpen ? 'hidden' : ''} ${delModelOpen ? 'opacity-25' : ''}`}>
                {/* Verified icon top-right */}
                <div className="absolute top-5 left-5">
                    <button onClick={() => setModelOpen(!modelOpen)} className='text-white border-[2px] border-white cursor-pointer px-3 py-1 rounded-full'>Edit</button>
                </div>


                <div className="absolute top-5 right-5">
                    {userData.isAccountVerified && (
                        <CheckCircle className="text-green-500 animate-pulse" size={28} />
                    )}
                </div>

                <div className="absolute bottom-2 right-2">
                    {userData.isAccountVerified && (
                        <MdDelete onClick={() => setDelModelOpen(!delModelOpen)} className='text-red-600 cursor-pointer' size={26} />
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

                    <span className={`text-xs mt-2 px-3 py-1 rounded-full font-medium shadow-sm ${userData.isAccountVerified
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