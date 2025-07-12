"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { animate, createScope, onScroll } from "animejs";
import styles from "./style.module.css";
import bagImage from '@/public/bag.png'
import bgImage from "@/public/landing-back-ground.png"
import frontImg from "@/public/Landing-front.png";
type AnimeScope = {
    add: (callback: () => void) => void;
  };
export default function LandingImage() {
  const root = useRef(null);
  const scope = useRef<AnimeScope | null>(null);

  useEffect(() => {
    if (!root.current) return;

    scope.current = createScope({ root }).add(() => {
      const scrollConfig = {
        container: ".scroll-container",
        sync: 1,
        enter: "50% 50%",
        leave: "80.5% 130%",
      };

      animate(".down-animate", {
        y: "1000px",
        duration: 2000,
        alternate: true,
        ease: "linear",
        autoplay: onScroll(scrollConfig),
      });

      animate(".swep-animate", {
        x: "1000px",
        duration: 2000,
        alternate: true,
        ease: "linear",
        autoplay: onScroll(scrollConfig),
      });
    });
  }, []);

  return (
    <div ref={root} className={`${styles.landingImageContainer} scroll-container`}>
      <div className={styles.landingImage}>

        {/* Background Images */}

        <div className={`${styles.landingBackGround}`}>
          <motion.div
            className={styles.backGroungImgContainer}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 190 }}
            transition={{
              opacity: { duration: 1, delay: 1.2, ease: "linear" },
              x: { duration: 1, delay: 1.2, ease: "linear" },
            }}
          >
            <Image
              fill
              className={`${styles.backGroundImg} swep-animate`}
              alt="background-img"
              src={bgImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              
            />
          </motion.div>
          <motion.div
            className={styles.backGroungImgContainer}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: -190 }}
            transition={{
              opacity: { duration: 1, delay: 1.2, ease: "linear" },
              x: { duration: 1, delay: 1.2, ease: "linear" },
            }}
          >
            <Image
              fill
              alt="background-img"
              className={`${styles.backGroundImg} swep-animate`}
              src={bgImage} 
              loading='eager'
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{transform: 'scaleX(-1)'}}
            />
          </motion.div>
        </div>



        {/* Front Image */}
        <motion.div
          className={`${styles.frontImgContent} down-animate`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            opacity: { duration: 1.2, delay: 0, ease: "linear" }, // تظهر في ثانية
          }}
        >
          <Image fill fetchPriority='high'   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="front" src={frontImg} style={{ objectFit: "cover" }} />
        </motion.div>

        {/* Bag Image */}
        <div className={`${styles.imgContainer} down-animate`}>
          <motion.div
            className={styles.imgContent}
            initial={{ scale: 0, opacity: 0, y: 600 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
                scale: { duration: .5, delay: .5, ease: "linear" },
                opacity: { duration: .5, delay: 0, ease: "linear" },
                y: { duration: 1, delay: .25, ease: 'linear' },
              }}
          >
            <Image fetchPriority='high'  fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="bag" src={bagImage}  style={{
              objectFit: 'contain'
            }}/>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
