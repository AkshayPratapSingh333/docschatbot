'use client'

import React from 'react'
import { signOut } from 'next-auth/react'
// import { redirect } from 'next/dist/server/api-utils'

export default function signOutButton({type} : {type?:string}) {
  return (
    <div>
      <button className='bg-black text-white rounded-md p-2 hover:bg-gray-400'
       onClick={() => signOut({callbackUrl: type == "Admin" ? "/admin/login" : "/login",redirect:true})}>Sign Out</button>
    </div>
  )
}
