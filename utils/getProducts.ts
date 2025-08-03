export const getAllProducts = async () => {
  const products = await fetch(
    
    `${process.env.BASE_URL}/api/products/get-all-products`,
    {
      next: { revalidate: 86400 }, 
    }
  ).then(res => res.json())
  if (!products || products.length === 0) {
    return null;
  }
  return products
};