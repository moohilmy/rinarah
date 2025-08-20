"use client";
import React from "react";
import { toast } from "react-toastify";

export default function ApproveBtn({
  adminID,
  productID,
  token,
}: {
  adminID: string;
  productID: string;
  token: string;
}) {
  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/${adminID}/approve-product/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `RLUX ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success(data.message || "Product approved successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Network error, please try again later.");
    }
  };

  return (
    <div>
      <button
        onClick={() => handleApprove(productID)}
        className="rinarahBtn bg-green-400 hover:bg-green-700"
      >
        Approve
      </button>
    </div>
  );
}
