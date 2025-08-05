import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "fallback-secret";
const DATABASE_URL: string = process.env.DATABASE_URL || "";
const SERVER_URL: string = process.env.SERVER_URL || "";

if (!DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set!");
    process.exit(1);
}

if (!JWT_SECRET || JWT_SECRET === "fallback-secret") {
    console.error("JWT_SECRET environment variable is not set!");
    process.exit(1);
}

console.log("Environment variables loaded successfully");
console.log("DATABASE_URL starts with:", DATABASE_URL.substring(0, 20) + "...");

export {
    JWT_SECRET,
    DATABASE_URL,
    SERVER_URL
};
