const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId


const User = new Schema({
    username: String,
    email: {type: String, unique: true},
    password:String
})

const Admin = new Schema({
    username: String,
    email: {type: String, unique: true},
    password: String
})

const Course = new Schema({
    name: String,
    price: Number,
    quantity: Number,
    addedBy: ObjectId // will contain admin name -> can be on delete cascase + ref
})

const Purchase = new Schema({
    purchaseId: Number,
    purchasedBy: ObjectId, // will keep user id here
    purchaseAmount: Number,
    courseId: ObjectId
    
})


const UserModel = mongoose.model('users', User);
const AdminModel = mongoose.model('admins', Admin);
const CourseModel = mongoose.model('courses', Course);
const PurchaseModel = mongoose.model('purchases', Purchase);

module.exports = {
    UserModel,
    AdminModel,
    CourseModel,
    PurchaseModel
}