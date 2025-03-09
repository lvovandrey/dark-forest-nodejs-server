const Router = require('express')
const router = new Router()
const authController = require('./authController')

router.post('/login', authController.login)
router.get('/user', authController.tryGetUser)

module.exports = router 