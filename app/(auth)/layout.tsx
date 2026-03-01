// Next.js
import Image from "next/image";


// Photo collage configuration
const PHOTOS = [
	{ src: "/banners/inoxtag-banner.png", alt: "Inoxtag", top: "4%", left: "5%", rotate: -6, w: 240, h: 300, z: 2 },
	{ src: "/banners/doigby-banner.png", alt: "Doigby", top: "2%", left: "45%", rotate: 4, w: 220, h: 280, z: 1 },
	{
		src: "/banners/michou/michou-banner.png",
		alt: "Michou",
		top: "44%",
		left: "8%",
		rotate: 3,
		w: 200,
		h: 260,
		z: 3,
	},
	{ src: "/banners/anthony-banner.png", alt: "Anthony", top: "48%", left: "48%", rotate: -5, w: 230, h: 290, z: 2 },
];

/**
 * Authentication layout with a photo collage on the left and form area on the right.
 * @param props - Component props
 * @param props.children - Auth form content
 * @returns A split layout for authentication pages
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen bg-gray-900">
			{/* Left: photo collage */}
			<div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
				<div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

				{/* Radial glow spots */}
				<div className="from-primary-500/15 absolute top-[15%] left-[20%] h-80 w-80 rounded-full bg-gradient-to-br to-transparent blur-[100px]" />
				<div className="absolute right-[10%] bottom-[20%] h-64 w-64 rounded-full bg-gradient-to-tl from-indigo-500/10 to-transparent blur-[80px]" />
				<div className="absolute top-[60%] left-[50%] h-48 w-48 rounded-full bg-gradient-to-br from-purple-500/8 to-transparent blur-[60px]" />

				{/* Dot pattern */}
				<div
					className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: "radial-gradient(rgba(255,255,255,.3) 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>

				{/* Photos */}
				{PHOTOS.map((photo) => (
					<div
						key={photo.alt}
						className="group absolute overflow-hidden rounded-2xl shadow-2xl ring-1 shadow-black/40 ring-white/10 transition-all duration-700 ease-out hover:scale-[1.03] hover:shadow-black/60 hover:ring-white/20"
						style={{
							top: photo.top,
							left: photo.left,
							transform: `rotate(${photo.rotate}deg)`,
							width: photo.w,
							height: photo.h,
							zIndex: photo.z,
						}}
					>
						<Image
							src={photo.src}
							alt={photo.alt}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
							sizes="300px"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
						<div className="absolute right-0 bottom-0 left-0 p-4">
							<span className="text-sm font-semibold text-white/80">{photo.alt}</span>
						</div>
					</div>
				))}

				{/* Branding */}
				<div className="absolute right-0 bottom-8 left-0 z-10 flex flex-col items-center gap-3">
					<div className="flex items-center gap-3 rounded-2xl bg-white/5 px-6 py-3 ring-1 ring-white/10 backdrop-blur-md">
						<Image src="/logos/memora.png" alt="Memora" width={32} height={32} className="rounded-lg" />
						<div>
							<span className="font-serif text-lg font-bold text-white">Memora Hub</span>
							<p className="text-xs text-white/50">Gestion centralisée</p>
						</div>
					</div>
				</div>
			</div>

			{/* Right: form area */}
			<div className="flex flex-1 items-center justify-center bg-gray-900 p-6 lg:p-12">
				<div className="w-full max-w-md">{children}</div>
			</div>
		</div>
	);
}
