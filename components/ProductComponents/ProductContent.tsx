"use client";
import styles from "./style.module.css";
import { motion } from "framer-motion";

export default function ProductContent() {
  return (
    <div className="w-full wrapper-page">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          opacity: { duration: 1, delay: .2, ease: "linear" },
        }}
        viewport={{amount: .8 , once: true}}
        className={`${styles.prouductHeader} header-section`}
      >
        our Products
      </motion.h2>
    </div>
  );
}
