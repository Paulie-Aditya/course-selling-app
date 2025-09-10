const express = require("express")
const Router = express.Router

const jwt = require("jsonwebtoken");
const { z } = require("zod");
const {userAuth, adminAuth, JWT_SECRET} = require("../auth")
const bcrypt = require("bcrypt")
const { AdminModel }= require("../db")

const adminRouter = Router();


adminRouter.post("/signup", async (req, res)=> {
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

adminRouter.post("/signin", async (req, res)=> {
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
        const user = await AdminModel.findOne({
            email: req.body.email
        })
        if(!user){
            return res.send({
                "message":"Invalid credentials, email not found"
            })
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isMatch){
            return res.send({
                "message":"Invalid credentials, wrong password"
            })
        }


        const token = jwt.sign({
            userId: user._id.toString(),
            "role_id": 1
        }, JWT_SECRET)

        res.send({
            "token":token
        })
    }
    catch(err){
        res.send({
            "message":"Invalid credentials"
        })
    }
    
})


module.exports = {
    adminRouter : adminRouter
}