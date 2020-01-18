import React from 'react';

const useIsMounted = () => {
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
};

export default useIsMounted;
