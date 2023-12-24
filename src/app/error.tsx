"use client";

import { useRouter } from "next/navigation";

//Custom Error page to be displayed when any error is throwed
export default function Error() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-center">
        Error occurred while fetching data from the API
      </h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={() => router.push("/")}
      >
        Try again
      </button>
    </main>
  );
}
