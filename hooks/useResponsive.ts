"use client";

import { useMediaQuery } from "react-responsive";


/** Responsive breakpoint flags based on viewport width */
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
 * Provides responsive breakpoint flags using media queries.
 * @returns {ResponsiveBreakpoints} Boolean flags for each breakpoint
 */
export function useResponsive(): ResponsiveBreakpoints {
	// Granular breakpoints
	const isXs = useMediaQuery({ maxWidth: 375 });
	const isSm = useMediaQuery({ maxWidth: 640 });
	const isMd = useMediaQuery({ maxWidth: 768 });
	const isLg = useMediaQuery({ maxWidth: 1024 });
	const isXl = useMediaQuery({ maxWidth: 1280 });
	const is2xl = useMediaQuery({ minWidth: 1281 });

	// Device category breakpoints
	const isMobile = useMediaQuery({ maxWidth: 768 });
	const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
	const isDesktop = useMediaQuery({ minWidth: 1025 });

	return { isXs, isSm, isMd, isLg, isXl, is2xl, isMobile, isTablet, isDesktop };
}
