const express = require("express")
const Router = express.Router

const { z } = require("zod");
const {userAuth, adminAuth, JWT_SECRET} = require("../auth")
const {CourseModel, PurchaseModel}= require("../db")

const courseRouter = Router();


courseRouter.get("/purchases", userAuth, async(req, res)=> {
    const userId = req.id;
    // after userAuth, we are sure that this is indeed a user

    try{
        const purchases = await PurchaseModel.find({
            purchasedBy: userId
        })
        const courseIds = purchases.map(p=> p.courseId);
        const courses = await CourseModel.find({
            _id: {$in: courseIds}
        });

        res.json(courses)
    }
    catch(err){
        res.send({
            "message":"No courses found"
        })
    }
})

courseRouter.post("/buy", userAuth, async(req, res)=> {
    const userId = req.id;
    const courseName = req.body.courseName;
    const quantity = req.body.quantity;

    const course = await CourseModel.findOne({
        name: courseName
    })

    if(!course){
        res.send({
            "message": "Course not found"
        })
    }

    if(course.quantity >= quantity){
        course.quantity-= quantity;
        await course.save();
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

courseRouter.post("/create", adminAuth, async(req, res) => {
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

courseRouter.post("/delete", adminAuth, async(req, res) => {
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

courseRouter.get("/", async(req, res) => {
    const courses = await CourseModel.find()
    res.send(courses)
})

module.exports = {
    courseRouter: courseRouter
}