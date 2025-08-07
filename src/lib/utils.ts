import { clsx, type ClassValue } from "clsx"
import { error } from "console";
import { twMerge } from "tailwind-merge"



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateEnvironmentVariables() {
  const required = [
    "GOOGLE_API_KEY",
    "PINECONE_API_KEY",
    "PINECONE_INDEX_NAME",
    "MONGO_URL",
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET"
  ];

  for (const variable of required){
    if(!process.env[variable]){
      throw new Error(`Environment Variables Not Find : ${variable} `)
    }
  }
}


