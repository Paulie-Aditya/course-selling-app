const express = require("express")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { z } = require("zod");
const {userAuth, adminAuth, JWT_SECRET} = require("./auth")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { UserModel,  AdminModel, CourseModel, PurchaseModel }= require("./db")
const {userRouter} = require("./routes/user")
const {courseRouter} = require("./routes/courses")
const { adminRouter } = require("./routes/admin")

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

app.use('/user', userRouter);
app.use('/courses', courseRouter);
app.use('/admin', adminRouter);

app.listen(3000, () => {
    console.log("Server is running")
})