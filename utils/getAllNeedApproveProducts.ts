export const getAllNeedApproveProducts = async (adminID: string, token: string) => {
  try {
    const products = await fetch(
      `${process.env.BASE_URL}/api/${adminID}/get-product-need-aprove`,
      {
        cache: "no-store",
        headers:{
            "Authorization": `RLUX ${token}`
        }
      }
    );
    const data = await products.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};
