import express from "express"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { string, z } from 'zod'
import { contentModel, linkModel, tagModel, userModel } from "./db";
import { DATABASE_URL, JWT_SECRET } from "./etc/secrets/config";
import { userMiddleware } from "./Middleware";
import { random } from "./utils";
import cors from "cors";
import { KeepAlive, getServerUrl } from "./keepAlive";




const app = express();
const PORT = process.env.PORT || 3000;
const url = [
    "http://localhost:5173",
    "https://second-brain-frontend-six.vercel.app/"]

app.use(cors({

    origin: url,
    credentials: true,
}));

app.use(express.json())

// Health check endpoint for keep-alive pings
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: 'Server is running and healthy'
    });
});

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

app.post('/api/v1/signin', async (req, res) => {
    const { email, password } = req.body;

    const findUser = await userModel.findOne({ email });
    if (!findUser) {
        res.status(404).json({
            message: "User not Found"
        });
        return
    }
    const isPasswordMatch = await bcrypt.compare(password, findUser.password);
    if (isPasswordMatch) {
        const token = jwt.sign({
            id: findUser._id.toString()
        }, JWT_SECRET);
        res.json({
            message: "Signed IN",
            token
        })
    } else {
        return res.status(404).json({
            message: "Incorrect Credentials"
        })
    }

})

app.get('/api/v1/profile', userMiddleware, async (req, res) => {
    const userId = await req.userId;
    const profile = await userModel.findOne({
        _id: userId
    }).select('firstName')
    res.json({
        profile
    })
})

app.post('/api/v1/content', userMiddleware, async (req, res) => {
    const { link, type, title, tags = [] } = req.body;
    const userId = await req.userId
    try {
        const tagIds = [];
        for (const tagTitle of tags) {
            let tag = await tagModel.findOne({
                title: tagTitle
            })
            if (!tag) {
                tag = await tagModel.create({ title: tagTitle })
            }
            tagIds.push(tag._id);
        }

        await contentModel.create({
            link,
            type,
            title,
            tags: tagIds,
            userId
        })
        res.status(200).json({
            message: "Content added"
        })
    } catch (e) {
        return res.status(411).json({
            message: "Invalid content",
            error: e
        })
    }
})

app.get('/api/v1/content', userMiddleware, async (req, res) => {
    const userId = await req.userId;
    const content = await contentModel.find({
        userId: userId
    }).populate("userId", "firstName").populate("tags", "title")
    res.json({
        content
    })

})

app.delete('/api/v1/content', userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    await contentModel.deleteMany({
        _id: contentId,
        userId: req.userId
    })
    res.json({
        message: "content deleted"
    })

})

app.post('/api/v1/brain/share', userMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const existingLink = await linkModel.findOne({
            userId: req.userId
        })
        if (existingLink) {
            res.status(200).json({
                hash: existingLink.hash
            })
            return
        }
        const hash = random(10);
        await linkModel.create({
            userId: req.userId,
            hash: hash
        })
        res.status(200).json({
            message: "/share/" + hash
        })

    } else {
        await linkModel.deleteOne({
            userId: req.userId
        })
        res.status(200).json({
            message: "Remove sharable Link"
        })
    }



})

app.post('/api/v1/brain/:shareLink', async (req, res) => {
    const hash = req.params.shareLink;

    const link = await linkModel.findOne({
        hash
    })


    if (!link) {
        res.status(411).json({
            message: "Sorry Incorrect Input"
        })
        return
    }
    //userId
    const content = await contentModel.find({
        userId: link.userId
    })
    const user = await userModel.findOne({
        _id: link.userId
    });

    if (!user) {
        res.status(411).json({
            message: "User not found, error should ideally not happen"
        })
        return;
    }

    res.status(200).json({
        firstName: user.firstName,
        content: content
    })
})

mongoose.connect(DATABASE_URL)
    .then(() => {
        console.log("Connected to DataBase");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            
            // Start keep-alive service 
            const serverUrl = getServerUrl();
            if (serverUrl) {
                const keepAlive = new KeepAlive(serverUrl, 8); // Ping every 8 minutes
                keepAlive.start();
                console.log('🔄 Keep-alive service started');
            }
        });
    })
    .catch((e) => {
        console.log("Database connection Error", e);
    });