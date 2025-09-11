// utils/timing.ts

// Debounce: waits until user stops calling the function
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Throttle: allows function to run at most once every `limit` ms
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
) {
  let inThrottle = false;

  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
