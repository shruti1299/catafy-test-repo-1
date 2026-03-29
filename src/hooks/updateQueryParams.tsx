"use client";
import { useRouter } from "next/navigation";
const useUpdateQueryParams = () => {
  const router = useRouter();
  const updateQueryParams = (params: { [key: string]: string | null }) => {
    const currentParams = new URLSearchParams(window.location.search);
    Object.keys(params).forEach((key) => {
      if (params[key] === null) {
        currentParams.delete(key);
      } else {
        currentParams.set(key, params[key]!);
      }
    });
    router.push(`?${currentParams.toString()}`);
  };
  return updateQueryParams;
};

export default useUpdateQueryParams;
