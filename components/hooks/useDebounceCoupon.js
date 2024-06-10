import { useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';

const useDebounceCoupon = (callback, delay) => {
  const debouncedFunction = useCallback(
    debounce((text) => {
      if (text.length > 3) {
        callback(text);
      }
    }, delay),
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      debouncedFunction.cancel();
    };
  }, [debouncedFunction]);

  return debouncedFunction;
};

export default useDebounceCoupon;
