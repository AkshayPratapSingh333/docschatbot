 import {connect} from '@/app/database/mongo.config'
 import { NextRequest,NextResponse } from 'next/server' 
 import {loginSchema} from "@/validator/authSchema"
 import vine, { errors } from '@vinejs/vine'
 import ErrorReporter from '@/validator/ErrorReporter'
 import bcrypt from 'bcryptjs'
 import {User} from '@/models/User'

 connect();

 export async function POST(request:NextRequest){
    try {
    const body = await request.json();
    const validator = vine.compile(loginSchema)
    validator.errorReporter = () => new ErrorReporter();
    validator.errorReporter = () => new ErrorReporter()
    const output = await validator.validate(body)
    // login logic that if email id found then return logged in otherwise return email does not exist 
    const user = await User.findOne({email:output.email})
    if(user){
      const matchPassword = bcrypt.compareSync(output.password!,user.password);
      if(matchPassword){
        return NextResponse.json(
          {status:200,message:"User LoggedIn Succesfully"},{status:200}
        );
    }else 
    return NextResponse.json(
          {status:400,errors:{email:"Please Check Your Credentials"},},{status:200})
  }
    return NextResponse.json({status:400,errors:"No Account Found With This Email"},{status:200})
    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return NextResponse.json({status:400,errors:error.messages},{status:200})
          }
        
    }

 }