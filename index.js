const express = require("express")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { z } = require("zod");
const {userAuth, adminAuth, JWT_SECRET} = require("./auth")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
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
            userId: user._id.toString(),
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

app.get("/courses", userAuth, async(req, res)=> {
    const userId = req.id;
    // after userAuth, we are sure that this is indeed a user

    try{
        const courses = await CourseModel.findById(
            await PurchaseModel.find({
                purchasedBy: userId
            })
        )
        res.json(courses)
    }
    catch(err){
        res.send({
            "message":"No courses found"
        })
    }

    res.json(courses)
})

app.post("/purchase_course", userAuth, async(req, res)=> {
    const userId = req.id;
    const courseName = req.body.courseName;
    const quantity = req.body.quantity;

    const course = CourseModel.findOne({
        name: courseName
    })

    if(!course){
        res.send({
            "message": "Course not found"
        })
    }

    if(course.quantity >= quantity){
        course.quantity-= quantity;
        await PurchaseModel.create({
            purchasedBy: userId,
            purchaseAmount: quantity,
            courseId: course._id
        })
        res.send({
            "message":" Successfully purchased!"
        })
    }
    else{
        res.send({
            "message":"Quantity specified is not available at the moment"
        })
    }

})

app.post("/create_course", adminAuth, async(req, res) => {
    const {name, price, quantity, description } = req.body;
    try
    {
        await CourseModel.create({
            name: name,
            price: price,
            quantity: quantity,
            description: description,
            addedBy: req.id
        })
        res.send({
            "message":"Course successfully added"
        })
    }
    catch(err){
        res.send({
            "message":"Some error occurred"
        })
    }

})

app.post("/delete_course", adminAuth, async(req, res) => {
    const {name} = req.body;
    try
    {
        await CourseModel.deleteOne({
            name: name,
            addedBy: req.id
        })
        res.send({
            "message":"Course successfully deleted"
        })
    }
    catch(err){
        res.send({
            "message":"Some error occurred"
        })
    }
})

app.listen(3000, () => {
    console.log("Server is running")
})