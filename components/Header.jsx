import React, { useContext } from 'react'
import { assets } from '../src/assets/assets'
import { AppContext } from '../context/AppContext'

const Header = () => {
  const {userData} = useContext(AppContext)
  return (
    <div className='bg-red-100'>
        <img src={assets.header_img} alt="" className='w-lg'/>
        <h1>Hey {userData ? userData.name :"Developer"} <img src={assets.hand_wave} alt="" /></h1>
    </div>
  )
}

export default Header