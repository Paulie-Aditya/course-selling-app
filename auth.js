const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

function userAuth(req, res, next){
    const token = req.headers.authorization;

    try{
        const user = jwt.verify(token, JWT_SECRET);

        if(!user){
            return res.send({
                "message":"Unauthorized, invalid credentials"
            })
        }

        if(user.role_id != 2){
            return res.send({
                "message":"Unauthorized, not an user"
            })
        }

        req.id = user.userId
        next(); // ok
    }
    catch(err){
        console.log(err)
        return res.send({
            "message": "Unauthorized"
        })
    }
}

function adminAuth(req, res, next){
    const token = req.headers.authorization;

    try{
        const user = jwt.verify(token, JWT_SECRET);
        if(!user){
            return res.send({
                "message":"Unauthorized, invalid credentials"
            })
        }

        if(user.role_id != 1){
            return res.send({
                "message":"Unauthorized, not an admin"
            })
        }
        req.id = user.userId;
        next(); // ok
    }
    catch(err){
        console.log(err)
        return res.send({
            "message": "Unauthorized"
        })
    }
}

module.exports = {
    userAuth,
    adminAuth,
    JWT_SECRET
}