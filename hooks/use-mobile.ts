import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener('change', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mql.removeEventListener('change', checkMobile);
    };
  }, []);

  return !!isMobile;
}
