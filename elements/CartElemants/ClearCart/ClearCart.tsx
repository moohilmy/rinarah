"use client";
'use client'
import { useCartStore } from "@/store"
import { CiTrash } from "react-icons/ci";

export default function ClearCart() {
  const clearCart = useCartStore(s => s.clearCart)

  const handleClearCart = () => {
    clearCart()
    
  }

  return (
    <div
      onClick={handleClearCart}
      className="cursor-pointer text-xs font-bold items-center gap-1 flex justify-end uppercase text-primary"
    >
      <span>clear cart</span>
      <CiTrash />
    </div>
  )
}
