import Image from "next/image";
import styles from "./styles.module.css";
import logoImg from "@/public/logo-symbol.png";
import Link from "next/link";
export default function Logo() {
  return (
    <div className={styles.logoContainer}>
      <Image
        priority={true}
        className={styles.logoImg}
        src={logoImg}
        alt="logo-name"
        width={40}
        height={40}
      />
      <h1 className={styles.logoText}>rinarah </h1>
      <Link href={"/"} className={"rinaralink"} aria-label="logo" />
    </div>
  );
}
