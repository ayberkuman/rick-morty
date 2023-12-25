import Search from "@/components/SSR";
import { APIResponse } from "@/types";

// This is a React Server Component that fetches data on the server side
export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const response = await fetch(
    `https://rickandmortyapi.com/api/character?name=${query}&page=${currentPage}`
  );

  // Because there is no explanation about the error statuses in the API documentation
  // I only threw an error if the status is 500, I handled the 404 status in the Suggestions component
  if (response.status === 500) {
    throw new Error("Something went wrong!");
  }

  const data: APIResponse = await response.json();

  const totalPages = data?.info?.pages ?? 1;

  return (
    <main className="min-h-screen mx-auto md:py-5 md:mr-5">
      <Search
        options={data.results}
        totalPages={totalPages}
      />
    </main>
  );
}
