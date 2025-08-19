import { TOrder } from "@/types";
import { cookies } from "next/headers";
import React from "react";

const getAllOrders = async (token: string) => {
  const response = await fetch(
    `${process.env.BASE_URL}/api/app-control/${process.env.SECRET_URL}/orders`,
    {
      method: "GET",
      next: { revalidate: 60 * 60 * 1000 },
      headers: {
        Authorization: `RLUX ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
};
export default async function page() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("admin_token");
  if (!token) {
    return <div>Please log in to view orders.</div>;
  }

  const orders: TOrder[] = await getAllOrders(token.value);
  if (!orders || orders.length === 0) {
    return <div>No orders found.</div>;
  }
  return (
    <div className="w-full px-4 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <p className="text-gray-600 mb-6">
          Here you can view all the orders placed by customers.
        </p>
        count: {orders.length}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm ">
          <thead className="bg-primary text-background">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Order ID</th>
              <th className="px-4 py-2 text-left font-medium">
                Customer Email
              </th>
              <th className="px-4 py-2 text-left font-medium">Amount</th>
              <th className="px-4 py-2 text-left font-medium">
                Payment Status
              </th>
              <th className="px-4 py-2 text-left font-medium">Order Status</th>
              <th className="px-4 py-2 text-left font-medium">Shipping Name</th>
              <th className="px-4 py-2 text-left font-medium">City</th>
              <th className="px-4 py-2 text-left font-medium">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 font-mono text-xs text-gray-700">
                  {order._id?.slice(0, 8) ?? "N/A"}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  {order.customerEmail}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  {order.currency.toUpperCase()} {order.amountTotal.toFixed(2)}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === "succeeded"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "SHIPPED"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-800">
                  {order.shipping.name}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  {order.shipping.address.city}
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
