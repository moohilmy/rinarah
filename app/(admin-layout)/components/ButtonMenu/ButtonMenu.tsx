"use client";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { menu } from ".";
import { useParams, usePathname } from "next/navigation";

export default function ButtonMenu() {
  const [active, setActive] = useState<string>("");
  const params = useParams();
  const adminID = params.adminID;
  const pathName = usePathname();

  return (
    <nav className={styles.navList}>
      <ul className={styles.menuList}>
        {menu.map((i) => (
          <li
            key={i.name}
            className={`${styles.menuItem} ${
              pathName.includes(i.href) ||
              (active === "" && pathName.includes('orders'))
                ? styles.linkSelected
                : ""
            }`}
          >
            
              {i.icon}
              {i.name}
            <Link
              className=" absolute w-full h-full top-0 left-0"
              href={`/app-control/${process.env.NEXT_PUBLIC_SECRET_URL}/admin/${adminID}/${i.href}`}
              onClick={() => setActive(i.name)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
