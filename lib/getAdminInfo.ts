export const getAdminInfo = async (token: string) => {
  const res = await fetch(
    `${process.env.BASE_URL}/api/app-control/${process.env.SECRET_URL}/checkLogin`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `admin_token=${token}`,
      },
    }
  );
  const data = await res.json();
  return data;
};
