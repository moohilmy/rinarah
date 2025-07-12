import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { CartType } from "@/types";
import { getTaxPercent } from "@/utils";

const getTotalFromCookie = () => {
  const cookie = Cookies.get("totalCount");
  return cookie ? Number(cookie) : 0;
};

const calcTotals = (items: CartType[]) => {
  return items.reduce(
    (acc, i) => {
      acc.count += i.quantity;
      acc.weight += i.dimensions.weight * i.quantity;
      acc.subtotal += i.price * i.quantity;
      return acc;
    },
    { count: 0, weight: 0, subtotal: 0 }
  );
};

/* ---------- Types ---------- */
type CartState = {
  /* persisted */
  items: CartType[];
  totalCount: number;
  stateCode: string;
  shippingCost: number;
  clientSecret: {
    id: string;
    clientSecret: string;
  } | null;
  addToCart: (item: CartType) => boolean;
  setClientSecret: (clientSecret: { id: string; clientSecret: string }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setStateCode: (code: string) => void;
  setShippingCost: (cost: number) => void;

  totalWeight: () => number;
  subtotal: () => number;
  tax: () => number;
  grandTotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalCount: getTotalFromCookie(),
      stateCode: "",
      shippingCost: 0,
      clientSecret: null,
      setClientSecret: (clientSecret) => set({ clientSecret }),
      addToCart: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.id === item.id);

        let updated: CartType[];
        if (existing) {
          if (existing.quantity >= 9) return false;
          updated = items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          updated = [...items, item];
        }

        const { count } = calcTotals(updated);
        Cookies.set("totalCount", String(count));
        set({ items: updated, totalCount: count });
        return true;
      },

      removeFromCart: (id) => {
        const updated = get().items.filter((i) => i.id !== id);
        const { count } = calcTotals(updated);
        Cookies.set("totalCount", String(count));
        set({ items: updated, totalCount: count });
      },

      updateQuantity: (id, quantity) => {
        const updated = get().items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        );
        const { count } = calcTotals(updated);
        Cookies.set("totalCount", String(count));
        set({ items: updated, totalCount: count });
      },

      clearCart: () => {
        Cookies.remove("totalCount");
        set({ items: [], totalCount: 0, shippingCost: 0 });
      },

      setStateCode: (code) => set({ stateCode: code }),
      setShippingCost: (cost) => set({ shippingCost: cost }),

      totalWeight: () => calcTotals(get().items).weight,
      subtotal: () => calcTotals(get().items).subtotal,
      tax: () => {
        const percent = getTaxPercent(get().stateCode);
        return get().subtotal() * percent;
      },
      grandTotal: () => {
        const { shippingCost } = get();
        return get().subtotal() + get().tax() + shippingCost;
      },
    }),
    {
      name: "rinarah-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ items, totalCount }) => ({
        items,
        totalCount,
      }),
    }
  )
);
