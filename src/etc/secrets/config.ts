import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "fallback-secret";
const DATABASE_URL: string = process.env.DATABASE_URL || "fallback-db-url";

export {
    JWT_SECRET,
    DATABASE_URL
};
