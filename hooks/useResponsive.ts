"use client";

import { useMediaQuery } from "react-responsive";
import { BREAKPOINTS } from "@/constants";

// Responsive breakpoint flags based on viewport width
export interface ResponsiveBreakpoints {
	isXs: boolean;
	isSm: boolean;
	isMd: boolean;
	isLg: boolean;
	isXl: boolean;
	is2xl: boolean;
	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;
}

/**
 * Provides responsive breakpoint flags using media queries
 * @returns {ResponsiveBreakpoints} Boolean flags for each breakpoint
 */
export function useResponsive(): ResponsiveBreakpoints {
	// Granular breakpoints
	const isXs = useMediaQuery({ maxWidth: BREAKPOINTS.XS });
	const isSm = useMediaQuery({ maxWidth: BREAKPOINTS.SM });
	const isMd = useMediaQuery({ maxWidth: BREAKPOINTS.MD });
	const isLg = useMediaQuery({ maxWidth: BREAKPOINTS.LG });
	const isXl = useMediaQuery({ maxWidth: BREAKPOINTS.XL });
	const is2xl = useMediaQuery({ minWidth: BREAKPOINTS.XL + 1 });

	// Device category breakpoints
	const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS.MD });
	const isTablet = useMediaQuery({ minWidth: BREAKPOINTS.MD + 1, maxWidth: BREAKPOINTS.LG });
	const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS.LG + 1 });

	return { isXs, isSm, isMd, isLg, isXl, is2xl, isMobile, isTablet, isDesktop };
}
