'use client'
import {  redirect } from "next/navigation";
export default function NotFound() {
  return (
    <div className="sm:min-h-[85vh] min-h-screen flex items-center justify-center text-center p-10">
      <div>
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600">The page youre looking for doesnt exist.</p>
        <button className=" cursor-pointer" onClick={()=> {
          redirect('/')
        }}>Back To Home</button>
      </div>
    </div>
  );
}
