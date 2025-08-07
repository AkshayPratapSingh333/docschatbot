import NextAuth from "next-auth";
import {authOptions} from './options';

const handler =  NextAuth(authOptions);

//the same handler function will be used to handle both GET and POST requests to this API endpoint.
export {handler as GET , handler as POST};

