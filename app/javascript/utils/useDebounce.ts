import { useState, useEffect, ComponentState } from 'react';

const useDebounce = (state: ComponentState, delay: number): ComponentState => {
  const [debouncedState, setDebouncedState] = useState(state);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedState(state);
    }, delay);

    return (): void => {
      clearTimeout(handler);
    };
  }, [state]);

  return debouncedState;
};

export default useDebounce;
