import Link from "next/link";
import { redirect } from "next/navigation";

export default async function FailurePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; errorMessage?: string }>;
}) {
  const { error, errorMessage } = await searchParams;

  if (!error || !errorMessage) {
    redirect("/checkout");
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-2">
          {decodeURIComponent(error)}
        </h1>
        <p className="mb-4">{decodeURIComponent(errorMessage)}</p>
        <Link
          href="/checkout"
          className="inline-block mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          try again
        </Link>
      </div>
    </div>
  );
}
