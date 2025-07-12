import React from "react";
import styles from "./styles.module.css";
import Logo from "./Logo";
import NavLinks from "./NavLinks";


const Header = async ({
  links,
}: {
  links: { href: string; name: string }[];
}) => {
  
  return (
    <header className={styles.headerContainer}>
      <Logo />
        <NavLinks links={links} />
  
    </header>
  );
};

export default Header;
