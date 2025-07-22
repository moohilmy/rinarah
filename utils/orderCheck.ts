export const checkOrderIsCorrect = async (pi: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/order/check-order/${pi}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.order;
  } catch (error) {
    console.error("API validation error:", error);
    return null;
  }
};