import { useMemo } from "react";

// a custom hook that provides pagination at client side
export const usePagination = (
  totalCount: number,
  pageSize: number,
  currentPage: number,
  siblings: number
) => {
  // we will use useMemo to memoize all the possible return values of this function
  const paginationRange = useMemo(() => {
    // 1. calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // 2. helper function that returns an array of numbers representing range
    const range = (start: number, end: number) => {
      const ans: number[] = [];

      for (let i = start; i <= end; i++) {
        ans.push(i);
      }

      return ans;
    };

    if (totalPages <= 5) return range(1, totalPages);
    else {
      if (currentPage >= 1 && currentPage < 5) {
        return [...range(1, 5), "..."];
      } else if (currentPage > totalPages - 5 && currentPage <= totalPages) {
        return ["...", ...range(totalPages - 4, totalPages)];
      } else {
        return [
          "...",
          ...range(currentPage - siblings, currentPage + siblings),
          "...",
        ];
      }
    }
  }, [totalCount, pageSize, siblings, currentPage]);

  return paginationRange;
};
