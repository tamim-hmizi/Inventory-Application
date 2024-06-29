const Category = require('../models/category')
const Item = require('../models/item')
const { body, validationResult } = require('express-validator')
const asyncHandler = require('express-async-handler')

exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, 'name').exec()
    res.render('category_list', {
        title: 'Category List',
        category_list: allCategories,
    })
})

exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, allItemsByCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, 'name').exec(),
    ])
    if (category === null) {
        const err = new Error('Category not Found')
        err.status = 404
        return next(err)
    }
    res.render('category_detail', {
        title: 'Category Detail',
        category: category,
        category_items: allItemsByCategory,
    })
})

exports.category_create_get = (req, res, next) => {
    res.render('category_form', { title: 'Create Category' })
}

exports.category_create_post = [
    body('name', 'Name must be specified.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('description', 'Description must be specified.')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        const category = new Category({
            name: req.body.name,
            description: req.body.description,
        })
        if (!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Create Category',
                category: category,
                errors: errors.array(),
            })
            return
        } else {
            await category.save()
            res.redirect(category.url)
        }
    }),
]
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [category, allItemsByCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, 'name description').exec(),
    ])
    if (category === null) {
        res.redirect('/category/all')
    }
    res.render('category_delete', {
        title: 'Delete Category',
        category: category,
        category_items: allItemsByCategory,
    })
})
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const [category, allItemsByCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, 'name description').exec(),
    ])
    if (allItemsByCategory.length > 0) {
        res.render('category_delete', {
            title: 'Delete Category',
            category: category,
            category_items: allItemsByCategory,
        })
        return
    } else {
        await Category.findByIdAndDelete(req.body.id)
        res.redirect('/category/all')
    }
})
exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec()
    if (category === null) {
        const err = new Error('Category not found')
        err.status = 404
        return next(err)
    }
    res.render('category_form', {
        title: 'Update Category',
        category: category,
    })
})

exports.category_update_post = [
    body('name', 'Name must be specified.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('description', 'Description must be specified.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id,
        })
        if (!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Create Category',
                category: category,
                errors: errors.array(),
            })
            return
        } else {
            await Category.findByIdAndUpdate(req.params.id, category, {})
            res.redirect(category.url)
        }
    }),
]
