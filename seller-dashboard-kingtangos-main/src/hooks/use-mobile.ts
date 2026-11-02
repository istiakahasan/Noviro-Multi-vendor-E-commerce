
import * as React from "react";

// Define breakpoints
const BREAKPOINTS = {
  mobile: 640,    // Up to 640px - mobile
  tablet: 1024,   // 641px to 1024px - tablet
  // Above 1024px - desktop
} as const;

export function useDeviceType() {
  const [deviceType, setDeviceType] = React.useState<
    "mobile" | "tablet" | "desktop" | undefined
  >(undefined);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= BREAKPOINTS.mobile) {
        setDeviceType("mobile");
      } else if (width <= BREAKPOINTS.tablet) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop",
    deviceType,
  };
}

// For backward compatibility
export function useIsMobile() {
  const { isMobile } = useDeviceType();
  return isMobile;
}