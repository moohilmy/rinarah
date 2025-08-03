import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

export default async function Adminlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  const access = cookiesStore.get("id");

  if (!access) {
    return console.log('not access');
    
  }

  return <div>
    <div className=" text-4xl">admin id</div>
    {children}</div>;
}
