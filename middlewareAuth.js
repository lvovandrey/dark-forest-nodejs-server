const jwt = require("jsonwebtoken");
const { Secret_key } = require("./config");

module.exports = function (req, res, next) {

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token)
            throw new Error("Token not found");
        const decodedData = jwt.verify(token, Secret_key)
        req.user = decodedData
        next()                        
    }
    catch (e) {
        console.log(e)
        res.status(403).json({message : 'User is not autorized: '+ e.message})
    }

}