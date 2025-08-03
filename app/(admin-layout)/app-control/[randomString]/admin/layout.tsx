import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminInfo } from "@/lib/getAdminInfo"; 

export default async function Adminlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies(); 
  const token = cookiesStore.get("admin_token");

  if (!token) {
    return redirect(`/app-control/${process.env.SECRET_URL}/login`);
  }

  const res = await getAdminInfo(token.value);

  return (
    <div>
      {res.userName}
      {children}
    </div>
  );
}
