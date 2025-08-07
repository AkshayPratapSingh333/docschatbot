 import {connect} from '@/app/database/mongo.config'
 import { NextRequest,NextResponse } from 'next/server' 
 import bcrypt from 'bcryptjs'
 import {User} from '@/models/User'

 


 

 connect();
 export async function POST(request:NextRequest) {
        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync("aps997766", salt);
        await User.create({
            email:"akshayadmin77@gmail.com",
            password:password,
            name:"Admin",
            role:"admin"
        });

        return NextResponse.json({
            status:200,
            message:"Admin Created"
        });
    
  
}