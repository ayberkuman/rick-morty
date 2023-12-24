import { useEffect } from "react";

export const useResetPagination = (
  searchQuery: string,
  setCurrentPage: (page: number) => void
) => {
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);
};
