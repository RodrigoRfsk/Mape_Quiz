import { useRef } from "react";

export function usePersistFn<A extends unknown[], R>(
  fn: (...args: A) => R
): (...args: A) => R {
  const fnRef = useRef<(...args: A) => R>(fn);
  fnRef.current = fn;

  const persistFn = useRef<((...args: A) => R) | null>(null);

  if (!persistFn.current) {
    persistFn.current = function (this: unknown, ...args: A): R {
      return fnRef.current.apply(this, args);
    };
  }

  return persistFn.current;
}
