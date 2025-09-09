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
    description: String,
    addedBy: { type: ObjectId, ref: "admins" }
});

const Purchase = new Schema({
    purchasedBy: { type: ObjectId, ref: "users" },
    purchaseAmount: Number,
    courseId: { type: ObjectId, ref: "courses" }
});



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