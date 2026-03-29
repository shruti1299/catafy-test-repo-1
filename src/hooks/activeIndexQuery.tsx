"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
const useActiveIndexQuery = (data: { id: string }[], queryKey: string) => {
  const searchParams = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const idFromQuery = searchParams.get(queryKey);
    if (idFromQuery) {
      const selectedIndex = data.findIndex((item) => item.id === idFromQuery);
      if (selectedIndex !== -1) {
        setActiveIndex(selectedIndex);
      }
    }
  }, [searchParams, data, queryKey]);

  return activeIndex;
};

export default useActiveIndexQuery;
