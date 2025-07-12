
import styles from "./style.module.css";
import Image from "next/image";


export default function ProductDetails() {
  return (
    <section className={`${styles.productDetails} flex justify-center gap-2.5 wrapper-page`}>
      <div className={styles.productCardDetails}>
        <div className={styles.productContent}>
            <h1 className={styles.productDetailsHeader}>Egyption loofeh</h1>
            <p className={styles.productDescription}>Discover the secret of ancient Egyptian skincare with rinarah – 100% natural loofah handpicked from the fertile lands of the Nile. Grown under the warm Egyptian sun and traditionally processed to preserve its strength and purity, our loofah is perfect for exfoliating, stimulating blood circulation, and leaving your skin glowing.</p>
        </div>
        <div className={styles.productContentImg}>
            <Image loading="lazy" sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw" src={'/ads.png'} alt="ads" fill style={{
              objectFit: "cover",
              objectPosition: "center",
            }}/>
        </div>
      </div>
    </section>
  )
}
