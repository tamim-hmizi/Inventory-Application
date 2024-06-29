const express = require('express')
const router = express.Router()
const Item = require('../controllers/ItemController')
/* GET home page. */
router.get('/', Item.index)

module.exports = router
