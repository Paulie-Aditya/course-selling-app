const express = require("express")
const Router = express.Router;

const jwt = require("jsonwebtoken");
const { z } = require("zod");
const {userAuth, adminAuth, JWT_SECRET} = require("../auth")
const bcrypt = require("bcrypt")
const { UserModel }= require("../db")

const userRouter = Router();

userRouter.post("/signup", async (req, res)=> {
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

userRouter.post("/signin", async (req, res)=> {
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
    try{
        const user = await UserModel.findOne({
            email: req.body.email
        })
        if(!user){
            return res.send({
                "message":"Invalid credentials, No such email found"
            })
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isMatch){
            return res.send({
                "message":"Invalid credentials, wrong password"
            })
        }

        const token = jwt.sign({
            userId: user._id,
            "role_id": 2
        }, JWT_SECRET)

        res.send({
            "token":token
        })
    }
    catch(err){
        console.log(err)
        res.send({
            "message":"Invalid credentials, error"
        })
    }
    
})


module.exports = {
    userRouter: userRouter
}