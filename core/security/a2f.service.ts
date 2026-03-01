import { generateURI, generateSecret, verifySync } from "otplib";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";


const A2F_ISSUER = process.env.A2F_ISSUER || "Memora Hub";

/**
 * Generate a new A2F secret for a user
 * @param userId User ID
 * @param userEmail User email
 * @returns Object with secret and QR code data URL
 */
export async function generateA2FSecret(userId: string, userEmail: string) {
	const secret = generateSecret();

	// Store secret temporarily (not yet enabled)
	await prisma.user.update({
		where: { id: userId },
		data: { a2fSecret: secret },
	});

	// Generate OTP auth URI
	const otpauthUrl = generateURI({
		label: userEmail,
		issuer: A2F_ISSUER,
		secret,
		strategy: "totp",
	});

	// Generate QR code as data URL
	const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

	return { secret, qrCodeUrl };
}

// Check a TOTP code against a secret
function checkTOTP(code: string, secret: string): boolean {
	const result = verifySync({ token: code, secret });
	return result.valid;
}

/**
 * Enable A2F for a user after verifying a code
 * @param userId User ID
 * @param code OTP code to verify
 * @returns True if verification succeeded and A2F was enabled
 */
export async function enableA2F(userId: string, code: string): Promise<boolean> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { a2fSecret: true },
	});

	if (!user?.a2fSecret) return false;

	const isValid = checkTOTP(code, user.a2fSecret);
	if (!isValid) return false;

	// Enable A2F
	await prisma.user.update({
		where: { id: userId },
		data: { a2fEnabled: true },
	});

	return true;
}

/**
 * Verify an A2F code for a user
 * @param userId User ID
 * @param code OTP code
 * @returns True if the code is valid
 */
export async function verifyA2FCode(userId: string, code: string): Promise<boolean> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { a2fSecret: true, a2fEnabled: true },
	});

	if (!user?.a2fSecret || !user.a2fEnabled) return false;

	return checkTOTP(code, user.a2fSecret);
}

/**
 * Disable A2F for a user
 * @param userId User ID
 */
export async function disableA2F(userId: string): Promise<void> {
	await prisma.user.update({
		where: { id: userId },
		data: {
			a2fEnabled: false,
			a2fSecret: null,
		},
	});
}
