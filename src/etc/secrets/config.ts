import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "";
const DATABASE_URL: string = process.env.DATABASE_URL || "";

if (!DATABASE_URL) {
    process.exit(1);
}

if (!JWT_SECRET) {
    process.exit(1);
}
export {
    JWT_SECRET,
    DATABASE_URL
};
