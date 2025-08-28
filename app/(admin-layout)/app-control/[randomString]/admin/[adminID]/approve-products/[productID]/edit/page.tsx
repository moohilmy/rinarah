import React from 'react'

export default async function Page({
  params,
}: {
  params: Promise<{ productID: string }>;
}) {
  const { productID } = await params;
  return (
    <div>
      {productID}
    </div>
  )
}
