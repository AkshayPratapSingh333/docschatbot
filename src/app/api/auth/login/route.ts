import {connect} from '@/app/database/mongo.config'
import { NextRequest,NextResponse } from 'next/server' 
import {loginSchema} from "@/validator/authSchema"
import vine, { errors } from '@vinejs/vine'
import ErrorReporter from '@/validator/ErrorReporter'
import bcrypt from 'bcryptjs'
import {User} from '@/models/User'

export async function POST(request:NextRequest){
    try {
        // Ensure DB is connected
        await connect();

        const body = await request.json();
        const validator = vine.compile(loginSchema)
        validator.errorReporter = () => new ErrorReporter();
        
        const output = await validator.validate(body)
        
        // Find user by email
        const user = await User.findOne({email:output.email})
        
        if(!user) {
            return NextResponse.json(
                {
                    status:400,
                    errors:{email:"No account found with this email"}
                },
                {status:400}
            )
        }

        // Check password
        const matchPassword = await bcrypt.compare(output.password!, user.password);
        
        if(!matchPassword) {
            return NextResponse.json(
                {
                    status:400,
                    errors:{password:"Invalid credentials"}
                },
                {status:400}
            )
        }

        // Successful login
        return NextResponse.json(
            {
                status:200,
                message:"User logged in successfully"
            },
            {status:200}
        );

    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return NextResponse.json(
                {
                    status:400,
                    errors:error.messages
                },
                {status:400}
            )
        }
        
        // Log the error for debugging
        console.error('Login error:', error);
        
        return NextResponse.json(
            {
                status:500,
                errors:"An error occurred during login"
            },
            {status:500}
        )
    }
}