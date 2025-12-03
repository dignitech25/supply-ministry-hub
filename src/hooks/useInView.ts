import { useEffect, useState, RefObject } from 'react';

export const useInView = (
  ref: RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
): boolean => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        // Once triggered, stop observing
        observer.unobserve(element);
      }
    }, {
      threshold: 0.1,
      ...options,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref.current, options]);

  return isInView;
};
