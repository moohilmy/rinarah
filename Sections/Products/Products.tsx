import {ProductImage, ProductContent, ProductDetails, GetProducts} from '@/components'
import React from 'react'

import styles from './styles.module.css'
export default function Products() {
  return (
    <section id='product' className='relative block'>
      <ProductImage/>
      <div className={styles.productContentContianer}>
        <ProductContent/>
        <ProductDetails/>
        <GetProducts/>
      </div>
    </section>
  )
}
