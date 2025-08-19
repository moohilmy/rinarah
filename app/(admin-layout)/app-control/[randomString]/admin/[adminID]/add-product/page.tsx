import {ADDProduct} from '@/app/(admin-layout)/components'
import React from 'react'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function page() {
    const cookiesStore = await cookies(); 
    const token = cookiesStore.get("admin_token");
    const adminID = cookiesStore.get("admin_id");

    if (!token || !adminID) {
      return redirect(`/app-control/${process.env.SECRET_URL}/login`);
    }
  
  return (
    <div className='w-full p-8'>
      <ADDProduct adminID={adminID.value} token={token.value}/>
    </div>
  )
}
