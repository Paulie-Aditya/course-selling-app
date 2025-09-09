const express = require("express")
const jwt = require("jwt");
const dotenv = require("dotenv");
const { z } = require("zod");
const {userAuth, adminAuth, JWT_SECRET} = require("./auth")
const { mongoose } = require("./db")

const app = express()
dotenv.config();
const databaseUrl = process.env.DATABASE_URL;
mongoose.connect(databaseUrl)

app.get('/', (req, res)=>{
    res.send({
        "message": "Hello world"
    })
})

app.post("/user_signup", (req, res)=> {
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

    res.send(
        {
            "message":"You have signed up as a user!"
        }
    )

})

app.post("/admin_signup", (req, res)=> {
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

    res.send(
        {
            "message":"You have signed up as an admin!"
        }
    )
})

app.post("/user_signin", (req, res)=> {
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

    const token = jwt.sign({
        username: username,
        "role_id": 2
    })

    res.send({
        "token":token
    })
})

app.post("/admin_signin", (req, res)=> {
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

    const token = jwt.sign({
        username: username,
        "role_id": 1
    })

    res.send({
        "token":token
    })
})

app.listen(3000, () => {
    console.log("Server is running")
})