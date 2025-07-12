"use client";
import Image from "next/image";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function LandingName() {
  const container = useRef(null);

  return (
    <section className={styles.LandingNameSection}>
      <div ref={container} className={styles.landingContent}>
        <motion.div
          className={styles.brandLogo}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            ease: "linear",
            duration: 0.5,
            delay: 0.3,
          }}
          viewport={{ amount: 0.5, once: true }}
        >
          <Image
            src={"/logo-symbol.svg"}
            alt="logo-symbol"
            width={120}
            height={120}
          />
        </motion.div>
        <motion.p
          initial={{ x: -130, opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
          }}
          transition={{
            opacity: {
              ease: "linear",
              duration: 0.5,
              delay: 0.8,
            },
            x: {
              ease: "linear",
              duration: 1,
              delay: 0.2,
            },
          }}
          viewport={{ amount: 0.5, once: true }}
          className={styles.brandName}
        >
          rinarah
        </motion.p>
      </div>
      <div>
        <motion.p
          initial={{ y: -100, opacity: 0 }}
          whileInView={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            opacity: {
              ease: "linear",
              duration: .9,
              delay: 1.2,
            },
            y: {
              ease: "linear",
              duration: 1,
              delay: .3,
            },
          }}
          viewport={{ amount: 0.2, once: true }}
          className={`${styles.brandSlogan}`}
        >
          Inspired By Nature
        </motion.p>
      </div>
    </section>
  );
}
