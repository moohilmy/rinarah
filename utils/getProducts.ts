export const getAllProducts = async () => {
  try {
    const products = await fetch(
      `${process.env.BASE_URL}/api/products/get-all-products`,
      {
        next: { revalidate: 86400 },
      }
    );
    const data = await products.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};
