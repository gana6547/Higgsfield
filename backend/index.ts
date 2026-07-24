import express, { response, type Request, type Response } from "express"
import cors from "cors";
import bcrypt from "bcrypt"
import { prisma } from "./db";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { auth } from "./middleware/auth.middleware";
import { AuthRequest } from "./types/types";
import { avatarImageSchema, signInSchema, signupSchema } from "./schemas/auth.schema";
import { imageCreation } from "./image";
import { uuidv4 } from "zod";
import { generateVideo } from "./video";


const app = express();


app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.post("/api/v1/auth/signup", async (req: Request, res: Response) => {

    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.flatten().fieldErrors })

    }
    const { username, password } = parsed.data;
    const bcryptPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            username,
            password: bcryptPassword
        }
    }).then((Response) => {
        res.status(200).json({ user: Response })
    }).catch((err) => {
        res.status(500).json({ error: err })
    })

})

app.post("/api/v1/auth/signin", async (req: Request, res: Response) => {
    const parsed = signInSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.flatten().fieldErrors })
    }
    const { username, password } = parsed.data;
    const user = await prisma.user.findUnique({
        where: {
            username
        }
    })

    if (!user) {
        new Error("User not found")
    }

    const isMatchedPassword = await bcrypt.compare(password, user?.password);

    if (isMatchedPassword) {
        const token = jwt.sign({ userId: user?.id }, process.env.JWT_SECRET!);
        res.cookie("token", token, {
            sameSite: "lax",
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({ user: user?.username, token: token })
    }
    else {
        res.status(405).json({ message: "Unauthorized" });
    }


})

//authenticated
app.post("/api/v1/auth/logout", auth, (req: AuthRequest, res: Response) => {
    console.log(req.user);

    res.clearCookie("token");
    res.status(200).json({
        message: "Logout Sucessfully"
    })
})

app.post("/api/v1/auth/avatar", auth, async (req: AuthRequest, res: Response) => {
    const { success, data } = avatarImageSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ message: "Incorrect Data" })
    }

    const leftProfileId = uuidv4();
    const rightProfileId = uuidv4();
    const frontProfileId = uuidv4();

    await Promise.all([imageCreation("create the side profile of the user for the left side .It should be high quality protfolio type shoot photo", data.image, `./assets/${leftProfileId}.png`),

    imageCreation("create the side profile of the user for the right side .It should be high quality protfolio type shoot photo", data.image, `./assets/${rightProfileId}.png`),

    imageCreation("create the front profile for the user.It should be high quality protfolio type shoot photo", data.image, `./assets/${frontProfileId}.png`)


    ])
    //put them in S3 
    //then put into database


    res.status(200).json({ message: "Image created Successfully" })
})

app.post("api/v1/auth/video", async(req:Request,res:Response) => {
    
    generateVideo("The video opens with a medium, eye-level shot of a beautiful man with dark hair and warm brown eyes. She wears a magnificent, high-fashion flamingo dress with layers of pink and fuchsia feathers, complemented by whimsical pink, heart-shaped sunglasses. She walks with serene confidence through the crystal-clear, shallow turquoise water of a sun-drenched lagoon. The camera slowly pulls back to a medium-wide shot, revealing the breathtaking scene as the dress's long train glides and floats gracefully on the water's surface behind her. The cinematic, dreamlike atmosphere is enhanced by the vibrant colors of the dress against the serene, minimalist landscape, capturing a moment of pure elegance and high-fashion fantasy.",
         ["https://github.com/100xdevs-bootcamp-1/higgsy/blob/main/apps/backend/assets/8106a04c-bed5-4ac4-94ef-970c5aee1518.png",
        "https://github.com/100xdevs-bootcamp-1/higgsy/blob/main/apps/backend/assets/8106a04c-bed5-4ac4-94ef-970c5aee1518.png",
        " https://github.com/100xdevs-bootcamp-1/higgsy/blob/main/apps/backend/assets/09578560-870f-4b23-a1cb-b549aa38a23f.png"
        ],`/output/video.mp4`)

        res.json(200).json({message:"video created Successfully"})
})

app.get("api/v1/auth/video/:videoId", () => {

})

app.get("api/v1/auth/videos", () => {

})

app.get("api/v1/auth/credit", () => {

})

app.get("api/v1/auth/models", () => {

})

app.get("api/v1/auth/avatar/:avatarId", () => {

})

app.get("api/v1/auth/avatars", () => {

})

//authenticated
app.get("/api/v1/auth/me", auth, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            id: true,
            username: true
        }
    })

    res.status(200).json(user)
})

app.listen(8080, () => {
    console.log("server running on Port 8080");
})