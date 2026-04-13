// External libraries
import { PrismaClient } from "@prisma/client";


const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

/** Singleton PrismaClient instance shared across the application */
export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
