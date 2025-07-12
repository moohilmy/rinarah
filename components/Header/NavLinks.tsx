"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";

import Link from "next/link";
import { CheckoutElemant } from "@/elements";
interface NavLinksProps {
  links: { href: string; name: string }[];
}

export default function NavLinks({ links }: NavLinksProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        document.body.style.overflow = "";
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className={styles.navContainer}>
      <nav className={styles.navContainer}>
        <button
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className={styles.menuBtn}
        >
          <Image
            src={isMenuOpen ? "/x.svg" : "/menu.svg"}
            alt="menu button"
            width={24}
            height={24}
          />
        </button>

        <ul
          className={`${styles.navList} ${
            isMenuOpen ? styles.navListActive : ""
          }`}
        >
          {links.map((link, index) => (
            <li
              className={styles.navItem}
              key={index}
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              <Link
                href={link.href}
                className="rinaralink"
                aria-label={link.name}
              />
              {link.name}
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.cartItem}>
        <Link
          href={"/checkout"}
          onClick={() => {
            setIsMenuOpen(false);
          }}
          className="rinaralink"
          aria-label="shopping-cart"
        />
        <CheckoutElemant />
      </div>
    </div>
  );
}
