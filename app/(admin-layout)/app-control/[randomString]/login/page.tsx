import LoginForm from "@/app/(admin-layout)/components/LogInForm/LoginForm";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import React from "react";

export default async function page(context: {
  params: Promise<{ randomString: string }>;
}) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("admin_token");
  if(token !== undefined) return redirect(`/app-control/${process.env.SECRET_URL}/admin`)
  const { randomString } = await context.params;
  if (randomString !== process.env.SECRET_URL) {
    return notFound();
  }
  return (
    <div>
      <LoginForm secret={randomString} />
    </div>
  );
}
