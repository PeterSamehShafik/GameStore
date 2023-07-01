import React, { useEffect } from 'react'
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { baseURL } from '../index.js';
import axios from 'axios';

export default function GoogleOauth({currentUser}) {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams()
    const isLogin = () => {
      if(searchParams.get('message') === 'done'){
        localStorage.setItem('token', searchParams.get('token'))
        currentUser();
        navigate('/home')
      }
      else{
        navigate('/login')
      }
    
    }

    useEffect(() => {
      isLogin()
    }, [])
  return (
    <div className="w-100 vh-100 d-flex justify-content-center align-items-center position-absolute top-0">
        <div className="sk-chase">
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
        </div>
      </div>
    
  )
}
