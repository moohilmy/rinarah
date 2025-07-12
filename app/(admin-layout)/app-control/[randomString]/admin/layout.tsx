// import React from "react";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// export const getAdminInfo = async (token: string) => {
//   const res = await fetch(
//     `${process.env.BASE_URL}/api/app-control/${process.env.SECRET_URL}/checkLogin`,
//     {
//       headers: {
//         Cookie: `admin_token=${token}`,
//       },
//     }
//   );

//   return res;
// };
export default async function Adminlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const cookiesStore = await cookies();
  // const token = cookiesStore.get("admin_token");

  // if (!token) {
  //   return redirect(`/app-control/${process.env.SECRET_URL}/login`);
  // }

  // const res = await getAdminInfo(token.value);

  // const data = await res.json();
  // console.log(data);
  
  return <div>{children}</div>;
}
