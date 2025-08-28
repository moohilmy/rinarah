import { TProductRes } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAllNeedApproveProducts } from "@/utils/getAllNeedApproveProducts";
import Link from "next/link";
import ApproveBtn from "@/app/(admin-layout)/components/Btns/ApproveBtn"
// import EditBtn from "@/app/(admin-layout)/components/Btns/EditBtn";

export default async function Page() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("admin_token");
  const adminID = cookiesStore.get("admin_id");

  if (!token || !adminID) {
    return redirect(`/app-control/${process.env.SECRET_URL}/login`);
  }

  const productList: TProductRes[] = await getAllNeedApproveProducts(
    adminID.value,
    token.value
  );

  if (!productList || productList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <h1 className="text-3xl font-bold">
          Products are not need approval right now
        </h1>
        <p>Please check back later.</p>
        <Link
          href={`/app-control/${process.env.SECRET_URL}/admin/${adminID.value}/add-product`}
        >
          add product
        </Link>
      </div>
    );
  }

  return (
    <div className="wrapper-page w-full">
      <h1 className="text-2xl font-bold mb-6">Products Need Approval</h1>
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left border-b">ID</th>
            <th className="p-3 text-left border-b">Name</th>
            <th className="p-3 text-left border-b">Price</th>
            <th className="p-3 text-left border-b">In Stock</th>
            <th className="p-3 text-left border-b">Created By</th>
            <th className="p-3 text-center border-b ">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productList.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{p._id?.slice(0, 8) ?? "N/A"}</td>
              <td className="p-3 border-b">{p.productName}</td>
              <td className="p-3 border-b">${p.price}</td>
              <td className="p-3 border-b">{p.countofProduct}</td>
              <td className="p-3 border-b">
                {typeof p.whoCreated === "string" && p.whoCreated.slice(0, 8)}
              </td>
              <td className="p-3 border-b">
                <div className="flex gap-2 flex-row justify-center">
                  <ApproveBtn
                    productID={p._id}
                    adminID={adminID.value}
                    token={token.value}
                  />
                  {/* <EditBtn productID={p._id} adminID={adminID.value} /> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
