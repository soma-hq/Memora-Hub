// External libraries
import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "7d";

/** JWT token payload structure */
export interface JwtPayload {
	userId: string;
	email: string;
	role: string;
}

/**
 * Resolve JWT secret safely.
 * @returns JWT secret string
 * @throws If JWT_SECRET is missing in production
 */
function getJwtSecret(): string {
	const secret = process.env.JWT_SECRET;
	if (secret) return secret;

	if (process.env.NODE_ENV === "production") {
		throw new Error("JWT_SECRET is required in production");
	}

	return "dev-secret-change-me";
}

/**
 * Signs à JWT token with the given payload
 * @param payload - Data to encode in the token
 * @returns Signed JWT string
 */
export function signToken(payload: JwtPayload): string {
	return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifies and decodes à JWT token
 * @param token - JWT string to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token: string): JwtPayload | null {
	try {
		return jwt.verify(token, getJwtSecret()) as JwtPayload;
	} catch {
		return null;
	}
}
