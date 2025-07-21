import express from "express"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { z, ZodError } from 'zod'
import { userModel } from "./db";
import dotenv from "dotenv";

const app = express();
const PORT = 3000;
dotenv.config()

app.use(express.json())

app.post('/api/v1/signup', async (req, res) => {
    const requireBody = z.object({
        email: z.string().min(10).max(30).email(),
        password: z.string().min(8, { message: "password must be 8 latter" }).max(30, { message: "password must lessthan 30" }),
        firstName: z.string().min(5, { message: "firstname must be 5 latter" }).max(10, { message: "firstname must lessthan 10 latter" }),
        lastName: z.string().min(1, { message: "lastname must be 1 latter" }).max(10, { message: "lastname must lessthan 10 latter" }),
    })

    const parseDataWithSuccess = requireBody.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
        const errorMassages = parseDataWithSuccess.error.issues[0].message
        return res.status(411).json({
            errors: errorMassages
        })
    }

    const { email, password, firstName, lastName } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        await userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })
    } catch (error) {
        return res.status(208).json({
            error: "User Already Exist"
        });
    }
    res.status(200).json({
        message: "Done"
    })

})

app.post('/api/v1/signin', (req, res) => {
    const { email, password } = req.body;

    const findUser = userModel.findOne()

})

app.post('/api/v1/content', (req, res) => {

})

app.get('/api/v1/content', (req, res) => {

})

app.delete('/api/v1/content', (req, res) => {

})

app.post('/api/v1/brain/share', (req, res) => {

})

app.post('/api/v1/brain/:shareLink', (req, res) => {

})
async function main() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        throw new Error("DATABASE_URL environment variable is not defined.");
    }
    await mongoose.connect(dbUrl);

    app.listen(PORT, () => {
        console.log("server is running on http://localhost:3000");
    })
}

main()