import { useRef } from "react";

export function useDebounce<T extends (...args: any[]) => void>(
  fn: T,
  delay = 400
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: Parameters<T>) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
