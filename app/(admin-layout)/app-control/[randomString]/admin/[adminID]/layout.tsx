import {ButtonMenu} from "@/app/(admin-layout)/components/index";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Adminlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  const access = cookiesStore.get("admin_id");

  if (!access) {
    return redirect(`/app-control/${process.env.SECRET_URL}/login`);
  }

  return (
    <div className="flex md:flex-row  flex-col">
      <ButtonMenu />
      {children}
    </div>
  );
}
