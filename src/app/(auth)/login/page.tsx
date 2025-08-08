'use client'
import React,{useState, Suspense} from 'react'
import { useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import {signIn} from 'next-auth/react'
import Toast from '@/components/Toast'

const LoginContent = () => {
  const params = useSearchParams();
  useEffect(() => {
    console.log("The query is", params.get("error"));
  }, []);

  const [authState,setAuthState] = useState({
    email:"",
    password:"",
  });

  const [loading,setLoading] = useState<boolean>(false);
  const [errors,setErrors] = useState<loginErrortype>({});

  const submitForm  = () => {
    console.log("Auth State Is " , authState);

    axios.post("/api/auth/login",authState)
          .then((res) => {
            setLoading(false) 
            const response = res.data
            if(response.status==200){
              signIn("credentials",{
                email:authState.email,
                password:authState.password,
                callbackUrl:"/",
                redirect:true
              });

              console.log("User Login Successfully"); 
              toast.success("Login Successfully")
            }else if(response?.status==400){
              setErrors(response?.errors)
            }
            })
          .catch()
  }

  const signInWithGithub = async () => {
    await signIn("github", {
      callbackUrl: "/",
      redirect: true,
    });
  };

  const signInWithGoogle = async () => {
    await signIn("google", {
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-black">
      <Toast/>
      <div className="w-full max-w-md px-6">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <h2 className="text-3xl font-bold leading-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent sm:text-4xl text-center">
            Welcome 
          </h2>
          <p className="mt-2 text-base text-slate-300 text-center">
            Don't have an account? 
            <Link href='/register'><span className="text-blue-400 hover:text-blue-300 underline cursor-pointer pl-1 font-semibold transition-colors">Sign Up</span></Link>
          </p>
          <p className="mt-2 text-base text-slate-300 text-center">
            Are you an Admin?{" "}
            <Link href="/admin/login">
              <span className="text-blue-400 hover:text-blue-300 underline cursor-pointer pl-1 font-semibold transition-colors">
                Login here
              </span>
            </Link>
          </p>
          {params.get("message") ? (<p className='bg-blue-950/50 border border-blue-700/50 text-blue-300 font-medium rounded-xl p-3 mt-4'>{params.get("message")}</p>) : <></>}
          <form action="#" method="POST" className="mt-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-slate-200 block mb-2">
                  Email address
                </label>
                <div className="relative">
                  <input
                    className="flex h-12 w-full rounded-xl border-2 border-slate-600/50 bg-slate-700/50 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 hover:border-slate-500"
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setAuthState({...authState,email:e.target.value})}
                  />
                  <span className="text-red-400 font-medium text-sm mt-1 block">{errors?.email}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-200 block mb-2">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    className="flex h-12 w-full rounded-xl border-2 border-slate-600/50 bg-slate-700/50 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 hover:border-slate-500"
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => setAuthState({...authState,password:e.target.value})}
                  />
                  <span className="text-red-400 font-medium text-sm mt-1 block">{errors?.password}</span>
                </div>
                <div className="text-right mt-3">
                  <a href="/forgot-password" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">Forgot password?</a>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  className={`inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  onClick={submitForm}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : "Sign In"}
                </button>
              </div>
            </div>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800 text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              className="relative inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-600/50 bg-slate-700/30 px-4 py-3 font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-600/50 hover:border-slate-500 hover:shadow-lg hover:shadow-slate-900/50 transform hover:-translate-y-0.5"
              onClick={signInWithGithub}
            >
              <span className="mr-3 inline-block">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </span>
              Continue with Github
            </button>
          </div>
          <div className="space-y-3 mt-3">
            <button
              type="button"
              className="relative inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-600/50 bg-slate-700/30 px-4 py-3 font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-600/50 hover:border-slate-500 hover:shadow-lg hover:shadow-slate-900/50 transform hover:-translate-y-0.5"
              onClick={signInWithGoogle}
            >
              <span className="mr-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </span>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Login() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );

      const [loading,setLoading] = useState<boolean>(false);
      const [errors,setErrors] = useState<loginErrortype>({});
  
      const submitForm  = () => {
        console.log("Auth State Is " , authState);

        axios.post("/api/auth/login",authState)
              .then((res) => {
                setLoading(false) 
                const response = res.data
                if(response.status==200){
                  //we are using auth state to check user is valid or not by checking email and password after we get 200 response from server
                  signIn("credentials",{
                    email:authState.email,
                    password:authState.password,
                    callbackUrl:"/",
                    redirect:true
                  });

      
                  console.log("User Login Successfully"); 
                  toast.success("Login Successfully")
                }else if(response?.status==400){
                  setErrors(response?.errors)
                  // toast.error("Something went wrong");
                }
                })
              .catch()
        
      }
      //sign in with github
        const signInWithGithub = async () => {
         await signIn("github", {
            callbackUrl: "/",
            redirect: true,
           });
          };

       //sign in with google
         const signInWithGoogle = async () => {
          await signIn("google", {
              callbackUrl: "/",
              redirect: true,
            });
            };   



  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-black">
      <Toast/>
      <div className="w-full max-w-md px-6">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <h2 className="text-3xl font-bold leading-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent sm:text-4xl text-center">
            Welcome 
          </h2>
          <p className="mt-2 text-base text-slate-300 text-center">
            Don't have an account? 
            <Link href='/register'><span className="text-blue-400 hover:text-blue-300 underline cursor-pointer pl-1 font-semibold transition-colors">Sign Up</span></Link>
            
          </p>
            <p className="mt-2 text-base text-slate-300 text-center">
              Are you an Admin?{" "}
              <Link href="/admin/login">
                <span className="text-blue-400 hover:text-blue-300 underline cursor-pointer pl-1 font-semibold transition-colors">
                  Login here
                </span>
              </Link>
            </p>
          {params.get("message") ? (<p className='bg-blue-950/50 border border-blue-700/50 text-blue-300 font-medium rounded-xl p-3 mt-4'>{params.get("message")}</p>) : <></>}
          <form action="#" method="POST" className="mt-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-slate-200 block mb-2">
                  Email address
                </label>
                <div className="relative">
                  <input
                    className="flex h-12 w-full rounded-xl border-2 border-slate-600/50 bg-slate-700/50 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 hover:border-slate-500"
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setAuthState({...authState,email:e.target.value})}
                  />
                  <span className="text-red-400 font-medium text-sm mt-1 block">{errors?.email}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-200 block mb-2">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    className="flex h-12 w-full rounded-xl border-2 border-slate-600/50 bg-slate-700/50 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 hover:border-slate-500"
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => setAuthState({...authState,password:e.target.value})}
                  />
                  <span className="text-red-400 font-medium text-sm mt-1 block">{errors?.password}</span>
                </div>
                <div className="text-right mt-3">
                  <a href="/forgot-password" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">Forgot password?</a>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  className={`inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  onClick={submitForm}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : "Sign In"}
                </button>
              </div>
            </div>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800 text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              className="relative inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-600/50 bg-slate-700/30 px-4 py-3 font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-600/50 hover:border-slate-500 hover:shadow-lg hover:shadow-slate-900/50 transform hover:-translate-y-0.5"
              onClick={signInWithGithub}
            >
              <span className="mr-3 inline-block">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </span>
              Continue with Github
            </button>
          </div>

          <div className="space-y-3 mt-3">
            <button
              type="button"
              className="relative inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-600/50 bg-slate-700/30 px-4 py-3 font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-600/50 hover:border-slate-500 hover:shadow-lg hover:shadow-slate-900/50 transform hover:-translate-y-0.5"
              onClick={signInWithGoogle}
            >
              <span className="mr-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </span>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}