import { connect } from '@/app/database/mongo.config';
import { AuthOptions, ISODateString } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User as ModelUser } from '@/models/User';
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from 'next-auth/jwt';


export type CustomSession = {
  user?:CustomUser;
  expires:ISODateString;
}

export type CustomUser = {
  id?:string | null;
  name?:string | null;
  email?:string | null;
  role?:string | null;
  avatar?:string | null;
}


connect();
export const authOptions:AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET, 

  pages:{
    signIn:"/login",
  },
  callbacks: {
    // here connecting github with database
    async signIn({ user, account, profile, email, credentials }) {
     try {
       connect();

      const findUser = await ModelUser.findOne({email:user.email})
      if(findUser){
        return true
      }
      await ModelUser.create({name:user.name,email:user.email , role:"user"});//if user not found then create a new User 
      return true;
      
     } catch (error) {
      console.log("Error in signIn callback:", error);
      return false;
     }
    },
    async jwt({token,user} : {token:JWT , user:CustomUser}){
      if(user){
        user.role = user?.role == null ? "user" : user?.role;
        token.user = user;
      }
      return token;
    },
      async session({session,token,user} : {session:CustomSession , token:JWT ,  user:CustomUser}){
        session.user = token.user as CustomUser;
      return session;
    }

  },
    providers:[
        CredentialsProvider({
            name:"Next Auth",
            credentials:{
                email:{ label:"Email", type:"email", placeholder:"Enter your email"},
                password:{ label:"Password", type:"password" } 
            },
      async authorize(credentials, req) {
      // Add logic here to look up the user from the credentials supplied
      // const user = { id: "1", name: "Akshay Pratap Singh", email: credentials?.email }

      connect();
      const user = await ModelUser.findOne({ email: credentials?.email }); 

      if (user) {
        // Any object returned will be saved in `user` property of the JWT
        return user
      } else {
        // If you return null then an error will be displayed advising the user to check their details.
        return null

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      }
    }
    }),

    GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!
  }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })


    ]

    

}

// http://localhost:3000/api/auth/callback/google