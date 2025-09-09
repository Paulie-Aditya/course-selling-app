const express = require("express")
const jwt = require("jwt");
const dotenv = require("dotenv");
const { z } = require("zod");
const {userAuth, adminAuth, JWT_SECRET} = require("./auth")
const mongoose = require("mongoose")
const {bcrypt} = require("bcrypt")
const { UserModel,  AdminModel, CourseModel, PurchaseModel }= require("./db")


const app = express()
app.use(express.json());
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
mongoose.connect(databaseUrl)

app.get('/', (req, res)=>{
    res.send({
        "message": "Hello world"
    })
})

app.post("/user_signup", async (req, res)=> {
    const requiredBody = z.object({
        email: z.email(),
        username: z.string(),
        password: z.string()
    })

    const parsedData = requiredBody.safeParse(req.body);

    if(!parsedData.success){
        return res.send({
            "message":"Invalid format",
            "error": parsedData.error
        })
    }

    try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        await UserModel.create({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username
        })
    }
    catch (err){
        return res.send({
            "message": "You have already signed up!"
        })
    }


    res.send(
        {
            "message":"You have signed up as a user!"
        }
    )

})

app.post("/admin_signup", async (req, res)=> {
    const requiredBody = z.object({
        email: z.email(),
        username: z.string(),
        password: z.string()
    })

    const parsedData = requiredBody.safeParse(req.body);

    if(!parsedData.success){
        return res.send({
            "message":"Invalid format",
            "error": parsedData.error
        })
    }

     try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        await AdminModel.create({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username
        })
    }
    catch (err){
        return res.send({
            "message": "You have already signed up!"
        })
    }

    res.send(
        {
            "message":"You have signed up as an admin!"
        }
    )
})

app.post("/user_signin", async (req, res)=> {
    const requiredBody = z.object({
        email: z.email(),
        password: z.string()
    })

    const parsedData = requiredBody.safeParse(req.body);

    if(!parsedData.success){
        return res.send({
            "message":"Invalid format",
            "error": parsedData.error
        })
    }

    const user = await UserModel.findOne({
        email: req.body.email
    })
    if(!user){
        return res.send({
            "message":"Invalid credentials"
        })
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isMatch){
        return res.send({
            "message":"Invalid credentials"
        })
    }

    const token = jwt.sign({
        userId: user._id.toString(),
        "role_id": 2
    })

    res.send({
        "token":token
    })
})

app.post("/admin_signin", async (req, res)=> {
    const requiredBody = z.object({
        email: z.email(),
        password: z.string()
    })

    const parsedData = requiredBody.safeParse(req.body);

    if(!parsedData.success){
        return res.send({
            "message":"Invalid format",
            "error": parsedData.error
        })
    }

    const user = await AdminModel.findOne({
        email: req.body.email
    })
    if(!user){
        return res.send({
            "message":"Invalid credentials"
        })
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isMatch){
        return res.send({
            "message":"Invalid credentials"
        })
    }


    const token = jwt.sign({
        userId: user._id.toString(),
        "role_id": 1
    })

    res.send({
        "token":token
    })
})

app.listen(3000, () => {
    console.log("Server is running")
})