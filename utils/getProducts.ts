export const getAllProducts = async () => {
  const products = await fetch(
    
    `${process.env.BASE_URL}/api/products/get-all-products`,
    {
      next: { revalidate: 86400 }, 
    }
  );
  return products.json();
};