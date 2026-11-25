const router = require('express').Router();

const { signup, login, verifyEmail, getAllUsers, getOneUsers, updateUser} = require('../controllers/users')

const { authenticate } = require('../Middleware/authorization')

router.post('/signup', signup)
router.post('login', login)
router.get('getall', getAllUsers)
router.get('getoneUser', getOneUsers)
router.patch('updateuser/:id', updateUser)
router.post('verifyEmail', verifyEmail)

module.exports = router