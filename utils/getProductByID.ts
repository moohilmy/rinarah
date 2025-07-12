export const GetProductByID = async (id:string) => {
  const res = await fetch(
    `${process.env.BASE_URL}/api/products/${id}`,
    {
      next: {
        revalidate: 86400,
      },
    }
  );
  return res.json();
};