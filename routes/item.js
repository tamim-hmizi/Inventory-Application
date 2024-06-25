const express = require('express')
const router = express.Router()
const itemController = require('../controllers/ItemController')

router.get('/all', itemController.item_list)
router.get('/details/:id', itemController.item_detail)

router.get('/create', itemController.item_create_get)
router.post('/create', itemController.item_create_post)

router.get('/update/:id', itemController.item_update_get)
router.post('/update/:id', itemController.item_update_post)

router.get('/delete/:id', itemController.item_delete_get)
router.post('/delete/:id', itemController.item_delete_post)

module.exports = router
