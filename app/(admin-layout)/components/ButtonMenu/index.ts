import { RiDashboardLine, RiAddLine, RiCheckLine } from "react-icons/ri";
import { ReactNode } from "react";

interface MenuItem {    
  name: string;
  icon: ReactNode;
  href: string;
}

const menu: MenuItem[] = [
  { name: "orders", icon: RiDashboardLine({ size: 20 }), href: "/dashboard" },
  { name: "add product", icon: RiAddLine({ size: 20 }), href: "/add-product" },
  { name: "approve products", icon: RiCheckLine({ size: 20 }), href: "/approve-products" },
];

export { menu };