// Next.js
import { ImageResponse } from "next/og";


// Icon dimensions
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Generates the app favicon as a pink gradient square with the letter M.
 * @returns An ImageResponse containing the generated icon
 */
export default function Icon() {
	return new ImageResponse(
		<div
			style={{
				width: 32,
				height: 32,
				borderRadius: 8,
				background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<span style={{ fontSize: 18, fontWeight: 700, color: "white" }}>M</span>
		</div>,
		{ ...size },
	);
}
