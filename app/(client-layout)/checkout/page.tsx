'use client'
import { CheckoutForm, CheckoutList } from "@/components";
import styles from "./styles.module.css";
import { OurSummary } from "@/elements";
import { useCartStore } from "@/store";
import { EmptyCheckout, LoadingPage } from "@/loading";
import { useEffect, useState } from "react";

export default function Page() {
  
  const itemslength = useCartStore(s => s.items)
    const [hydrated, setHydrated] = useState(false);
  
    useEffect(() => {
      setHydrated(true);
    }, []);
    if(!hydrated) return <LoadingPage/>

  if(itemslength.length <= 0){
    return(
      <EmptyCheckout/>
    )
  }
  return (
    <>
      <OurSummary />

      <div className={`${styles.checkoutSection} `}>
        <div className={styles.checkoutContent}>
          <CheckoutForm />
        </div>
        <div className={styles.checkoutList}>
          <CheckoutList />
        </div>
      </div>
    </>
  );
}
