'use client'

import Image from "next/image"
import styles from './styles.module.css'
import logoImg from '@/public/logo-symbol.png'
import { motion } from "framer-motion";
import Link from "next/link";
export default function Logo() {
  return (
    <div className={styles.logoContainer}>
      <Image priority={true}  className={styles.logoImg} src={logoImg} sizes="33vw"  alt="logo-name" width={40} height={40}/>
      <motion.p
      initial={{opacity: 0 , x: -40}}
      whileInView={{opacity: 1, x: 0}}
      transition={{

      }}
      viewport={{once: true}}
      className={styles.logoText}
      >rinarah </motion.p>
      <Link href={'/'} className={'rinaralink'} aria-label='logo'/>
    </div>
  )
}
