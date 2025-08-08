import {getToken} from "next-auth/jwt";
import { NextRequest,NextResponse } from "next/server";
import { CustomUser } from "./app/api/auth/[...nextauth]/options";
export {default} from "next-auth/middleware";

export const config = {matcher:["/"]};

export async function middleware(request:NextRequest){
    const {pathname} = request.nextUrl
    // public routes any one can access
    if(pathname == "/login" || pathname == "/admin/login"){
        return NextResponse.next()
    }

    const token = await getToken({req:request})

    // User Protected Routes Means after login only these routes can be accessible by user  
    const userProtectedRoutes = ["/"];
    // Admin Protected Routes
    const adminProtectedRoutes = ["/admin/dashboard"];

    //Here we check token whether if  user , admin and unknown user have token or not 

    if(token == null && (userProtectedRoutes.includes(pathname) || adminProtectedRoutes.includes(pathname))){
        return NextResponse.redirect(new URL("/login?error=Login To Access This Route" , request.url))
    }


    // get user from token 
    const user:CustomUser | null = token?.user as CustomUser

    // when a user trying to access the admin routes 
    if(adminProtectedRoutes.includes(pathname) && user.role == "user"){
        return NextResponse.redirect(new URL("/admin/login?error=login first to access the admin routes" , request.url))
    }

    // For Privacy Of user So that Admin cannot access user details 
     if(userProtectedRoutes.includes(pathname) && user.role == "admin"){
        return NextResponse.redirect(new URL("/login?error=login first to access the admin routes", request.url))
    }

}
