const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/CategoryController')

router.get('/all', categoryController.category_list)
router.get('/details/:id', categoryController.category_detail)

router.get('/create', categoryController.category_create_get)
router.post('/create', categoryController.category_create_post)

router.get('/update/:id', categoryController.category_update_get)
router.post('/update/:id', categoryController.category_update_post)

router.get('/delete/:id', categoryController.category_delete_get)
router.post('/delete/:id', categoryController.category_delete_post)

module.exports = router
