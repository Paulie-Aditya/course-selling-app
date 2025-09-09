const jwt = require("jwt")
const dotenv = require("dotenv")
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


function auth(req, res, next){
    const token = req.headers.authorization;
    try{
        const user = jwt.verify(token, JWT_SECRET);
        req.id = user.id;
        next()
    }
    catch(err){
        return res.send({
            "message":"Unauthorized"
        })
    }
}

function userAuth(req, res, next){
    const token = req.headers.authorization;

    try{
        const user = jwt.verify(token, JWT_SECRET);

        if(!user){
            return res.send({
                "message":"Unauthorized"
            })
        }

        if(user.role_id != 2){
            return res.send({
                "message":"Unauthorized"
            })
        }
        req.id = user.id;
        next(); // ok
    }
    catch(err){
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
                "message":"Unauthorized"
            })
        }

        if(user.role_id != 1){
            return res.send({
                "message":"Unauthorized"
            })
        }
        req.id = user.id;
        next(); // ok
    }
    catch(err){
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