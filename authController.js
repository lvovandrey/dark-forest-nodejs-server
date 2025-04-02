const { users } = require("./users")
const jwt = require('jsonwebtoken');
const { Secret_key } = require("./config");
const { sleep } = require("./tools");


const generateAccessToken = (userId, username) => {
    const payload = {
        userId,
        username
    }
    return jwt.sign(payload, Secret_key, { expiresIn: "24h" })
}

class authController {
    async login(req, res) {
        try {
            const { username, password } = req.body
            const candidate = users.find(u => u.name === username && u.password === password)
            if (candidate) {
                const token = generateAccessToken(candidate.id, candidate.name)
                res.json({ token, login: candidate.name, userId: candidate.id })
            }
            else {
                throw new Error("Login or password is incorrect");
            }
        }
        catch (e) {
            console.log(e)
            res.status(400).json({ message: 'login error: ' + e.message })
        }
    }

    async tryGetUser(req, res) {
        try {

            await sleep(300)
            const token = req.headers.authorization.split(' ')[1]
            if (!!token === false)
                throw new Error("Token not found");
            const decodedData = jwt.verify(token, Secret_key)
            res.json({ user: decodedData})
        }
        catch (e) {
            console.log(e)
            res.status(403).json({ message: 'User is not autorized: ' + e.message })
        }
    }
}

module.exports = new authController()