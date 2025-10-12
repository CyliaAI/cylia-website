import React, { useEffect, useRef, useState } from 'react'
import { User, Lock, Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react'
import gsap from 'gsap'
import axios from 'axios'
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout/Layout'

const page = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const signupRef = useRef<HTMLDivElement>(null)
  const loginRef = useRef<HTMLDivElement>(null)


  
  useEffect(() => {
    gsap.to(panelRef.current, {
      translateX: showSignUp ? '-100%' : '0%',
      duration: 1,
      ease: 'power2.inOut',
    })
    gsap.to(loginRef.current, {
      opacity: showSignUp ? 0 : 100,
      duration: 0.7,
      ease: 'power2.inOut',
    })
    gsap.to(signupRef.current, {
      opacity: showSignUp ? 100 : 0,
      duration: 0.7,
      ease: 'power2.inOut',
    })
  }, [showSignUp])

  const handleLogin = () => {
    if (!showSignUp) {
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/`, { email: username, password: password, type: "login" })
        .then(result => {
          const data = result.data
          if (data) {
            if (data.message == "User doesn't exist") {
              alert(data.message)
              return;
            }
            if (data.message == "Incorrect password") {
              alert(data.message);
              return;
            }
            navigate("/workspace")
          }
        })
        .catch(err => console.log(err))
    } else {
      if (password !== confirmPassword) {
        alert("Passwords do not match!")
        return
      }

      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/vendors`, { email, user: username, password, type: "signup" })
        .then(result => {
          const data = result.data;
          if (data.message == "User already exists") {
            alert("User Already exists");
            return;
          }
          setShowSignUp(false)
        })
        .catch(err => console.log(err))
    }
  }

  const OauthLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  }

  return (
    <Layout showFooter={false} showNavbar={false} >
      <div className='w-screen h-screen flex items-center justify-center bg-black'>
        <div className='w-[60vw] absolute z-[1] h-[80vh] bg-white/5 rounded-lg pointer-events-none overflow-hidden shadow-lg border border-white/60 flex'>
          <div className={`w-[40%] p-10 text-white flex flex-col absolute left-[2vw] z-[11] justify-center top-[30vh] scale-150 items-center transition-all ${showSignUp ? "opacity-100 pointer-events-auto delay-700" : "opacity-0 pointer-events-none translate-y-10"}`}>
            <h2 className='text-white text-5xl font-semibold text-shadow-[0px_0px_16px_rgb(255,255,255)] animate-pulse'>Join Us!</h2>
            <p className="text-white/90 text-xl font-medium flex flex-col items-center leading-relaxed drop-shadow-lg">
              Sign up now to start your 
              <span className="text-cyan-400 font-semibold"> journey!</span>
            </p>
          </div>
          <div ref={loginRef} className='w-1/2 top-[17vh] absolute p-10 text-white flex flex-col justify-center'>
            <h2 className='text-3xl font-bold mb-8'>Login</h2>

            <div className='mb-4 flex items-center border-b pointer-events-auto border-gray-400'>
              <User className='mr-3 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Username'
                className='bg-transparent outline-none text-white w-full py-2'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className='mb-6 flex items-center border-b pointer-events-auto border-gray-400'>
              <Lock className='mr-3 text-gray-400 w-5 h-5' />
              <input
                type={`${showPassword ? "text" : "password"}`}
                placeholder='Password'
                className='bg-transparent outline-none text-white w-full py-2'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!showPassword ? <Eye onClick={() => setShowPassword(true)} className='mr-3 text-gray-400 w-5 h-5 cursor-pointer' /> : <EyeOff onClick={() => setShowPassword(false)} className='mr-3 text-gray-400 w-5 h-5 cursor-pointer' />}
            </div>

            <button
              onClick={handleLogin}
              className='bg-gradient-to-r from-green-500 to-green-400 pointer-events-auto text-white font-semibold py-2 rounded-full shadow-md hover:opacity-90 transition-all'
            >
              Login
            </button>

            <p className='mt-4 text-sm'>
              Don’t have an account?{' '}
              <span onClick={() => setShowSignUp(true)} className='text-green-400 pointer-events-auto cursor-pointer hover:underline'>
                Sign Up
              </span>
            </p>

            <p className='text-gray-400 text-center font-semibold py-4'>Or</p>

            <div className='flex'>
              <button className='bg-gray-100 flex items-center text-black px-4 py-2 rounded-full border-gray-400 border-4 w-full justify-center gap-2 cursor-pointer hover:bg-gray-300 pointer-events-auto transition-all duration-300' onClick={OauthLogin}><FcGoogle /> Sign in using Google</button>    
            </div>
          </div>

          <div ref={panelRef} className='relative z-10 right-[-30vw] top-[-42vh] w-1/2 h-[160vh] bg-gradient-to-tr from-green-600 to bg-emerald-400 pointer-events-none  backdrop-saturate-200 text-black text-center px-6 flex flex-col justify-center items-center rounded-lg origin-left' />
        
          <div ref={signupRef} className='w-1/2 p-10 text-white flex flex-col absolute right-[0vw] top-[5vh] justify-center'>
            <h2 className='text-3xl font-bold mb-8'>Sign Up</h2>

            <div className='mb-4 flex items-center border-b pointer-events-auto border-gray-400'>
              <User className='mr-3 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Username'
                className='bg-transparent outline-none text-white w-full py-2'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className='mb-4 flex items-center pointer-events-auto border-b border-gray-400'>
              <Mail className='mr-3 text-gray-400 w-5 h-5' />
              <input
                type='email'
                placeholder='Enter Your Email'
                className='bg-transparent outline-none text-white w-full py-2'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='mb-6 flex pointer-events-auto items-center border-b border-gray-400'>
              <Lock className='mr-3 text-gray-400 w-5 h-5' />
              <input
                type={`${showPassword ? "text" : "password"}`}
                placeholder='Password'
                className='bg-transparent outline-none text-white w-full py-2'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!showPassword ? <Eye onClick={() => setShowPassword(true)} className='mr-3 text-gray-400 w-5 h-5 cursor-pointer' /> : <EyeOff onClick={() => setShowPassword(false)} className='mr-3 text-gray-400 w-5 h-5 cursor-pointer' />}
            </div>
            <div className='mb-6 flex items-center pointer-events-auto border-b border-gray-400'>
              <LockKeyhole className='mr-3 text-gray-400 w-5 h-5' />
              <input
                type={`${showPassword ? "text" : "password"}`}
                placeholder='Confirm Password'
                className='bg-transparent outline-none text-white w-full py-2'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleLogin}
              className='bg-gradient-to-r from-green-500 to-green-400 pointer-events-auto text-white font-semibold py-2 rounded-full shadow-md hover:opacity-90 transition-all'
            >
              Sign up
            </button>

            <p className='mt-4 text-sm'>
              Already have an account?{' '}
              <span onClick={() => {setShowSignUp(false)
                                    setShowPassword(false)
              }} className='text-green-400 cursor-pointer pointer-events-auto hover:underline'>
                Login
              </span>
            </p>
            
          </div>
          <div className={`w-[40%] p-10 z-[11] text-white flex flex-col absolute pointer-events-none right-[3vw] justify-center top-[30vh] scale-150 items-center transition-all ${showSignUp ? "opacity-0 pointer-events-none translate-y-10" : "opacity-100 pointer-events-auto delay-700"}`}>
            <h2 className='text-white text-2xl font-semibold text-shadow-[0px_0px_16px_rgb(255,255,255)] animate-pulse'>Welcome Back Vendor!</h2>
            <p className="text-white/90 text-md ml-6 font-medium drop-shadow-lg">
              Manage your listings and update new ones on your  
              <span className="text-cyan-400 font-semibold"> vendor portal!</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default page
