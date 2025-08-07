 import {connect} from '@/app/database/mongo.config'
 import { NextRequest,NextResponse } from 'next/server' 
 import {registerSchema} from "@/validator/authSchema"
 import vine, { errors } from '@vinejs/vine'
 import ErrorReporter from '@/validator/ErrorReporter'
 import bcrypt from 'bcryptjs'
 import {User} from '@/models/User'

 

//  { "name": "test",
//   "email": "test@example.com",
//   "password": "password123",
//   "password_confirmation": "password123"
// }
 
 // connecting DB 
interface UserPayload {
  name: string;
  email: string;
  password: string;
  avtar?: string;
}

 connect();
 export async function POST(request:NextRequest) {
    
   try {
    const body: UserPayload = await request.json();
    vine.errorReporter = () => new ErrorReporter();
    const validator = vine.compile(registerSchema);
    const output = await validator.validate(body);

    // Check if already email exist 
   const user = await User.findOne({ email: output.email });
   if(user){
    return NextResponse.json({
      status:400,
      errors:{
        email:"Email already exist try with another"

      }
    },{status:200})
   }else{
        // hashing the password
    const salt = bcrypt.genSaltSync(10);
    output.password = bcrypt.hashSync(output.password, salt);
    await User.create(output)

    return NextResponse.json({status:200,message:"Your Account Created Succesfully !! Now Login Please"},{status:200})

   }

   } catch (error) {
  if (error instanceof errors.E_VALIDATION_ERROR) {
    return NextResponse.json({status:400,errors:error.messages},{status:200})
  }
   
 }
}