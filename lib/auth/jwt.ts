// External libraries
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";

/** JWT token payload structure */
export interface JwtPayload {
	userId: string;
	email: string;
	role: string;
}

/**
 * Signs a JWT token with the given payload
 * @param payload - Data to encode in the token
 * @returns Signed JWT string
 */
export function signToken(payload: JwtPayload): string {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifies and decodes a JWT token
 * @param token - JWT string to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token: string): JwtPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as JwtPayload;
	} catch {
		return null;
	}
}
