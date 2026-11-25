const router = require('express').Router();

const { createPost } = require('../controllers/posts');

const upload = require('../Middleware/multer')

router.post('/createPost', upload.array('media', 5), createPost)

module.exports = router