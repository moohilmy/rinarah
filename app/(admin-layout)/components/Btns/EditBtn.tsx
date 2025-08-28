'use client'

import { useRouter } from "next/navigation";


export default function EditBtn({ productID,adminID }: { productID: string, adminID: string }) {

  const router = useRouter();
  const handleEdit = () => {
    router.replace(`/app-control/${process.env.SECRET_URL}/admin/${adminID}/approve-products/${productID}/edit`);
  };
  return (
    <div className="rinarahBtn" style={{
      backgroundColor: "#3b82f6",
      cursor: "pointer"
    }}>
      <button onClick={handleEdit}>Edit</button>
    </div>
  )
}
