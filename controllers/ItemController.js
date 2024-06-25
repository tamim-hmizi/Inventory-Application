const Item = require('../models/item')
const Category = require('../models/category')
const { body, validationResult } = require('express-validator')
const asyncHandler = require('express-async-handler')

exports.item_list = asyncHandler(async (req, res, next) => {
    const allItems = await Item.find().populate('category').exec()
    res.render('item_list', {
        title: 'Item List',
        item_list: allItems,
    })
})

exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate('category').exec()
    if (item === null) {
        const err = new Error('Item not found')
        err.status = 404
        return next(err)
    }
    res.render('item_detail', {
        title: 'Item Detail',
        item: item,
    })
})

exports.item_create_get = asyncHandler(async (req, res, next) => {
    const categories = await Category.find().exec()
    res.render('item_form', { title: 'Create Item', categories: categories })
})

exports.item_create_post = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Name must be specified.')
        .isAlphanumeric()
        .withMessage('Name has non-alphanumeric characters.'),
    body('description')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Description must be specified.')
        .isAlphanumeric()
        .withMessage('Description has non-alphanumeric characters.'),
    body('category')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Category must be specified.'),
    body('price')
        .trim()
        .isNumeric()
        .withMessage('Price must be a number.')
        .escape(),
    body('numberInStock')
        .trim()
        .isNumeric()
        .withMessage('Number in stock must be a number.')
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
        })
        if (!errors.isEmpty()) {
            const categories = await Category.find().exec()
            res.render('item_form', {
                title: 'Create Item',
                categories: categories,
                item: item,
                errors: errors.array(),
            })
            return
        } else {
            await item.save()
            res.redirect(item.url)
        }
    }),
]

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).exec()
    if (item === null) {
        res.redirect('/items')
    }
    res.render('item_delete', {
        title: 'Delete Item',
        item: item,
    })
})

exports.item_delete_post = asyncHandler(async (req, res, next) => {
    await Item.findByIdAndRemove(req.body.itemid)
    res.redirect('/items')
})

exports.item_update_get = asyncHandler(async (req, res, next) => {
    const [item, categories] = await Promise.all([
        Item.findById(req.params.id).exec(),
        Category.find().exec(),
    ])
    if (item === null) {
        const err = new Error('Item not found')
        err.status = 404
        return next(err)
    }
    res.render('item_form', {
        title: 'Update Item',
        item: item,
        categories: categories,
    })
})

exports.item_update_post = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Name must be specified.')
        .isAlphanumeric()
        .withMessage('Name has non-alphanumeric characters.'),
    body('description')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Description must be specified.')
        .isAlphanumeric()
        .withMessage('Description has non-alphanumeric characters.'),
    body('category')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Category must be specified.'),
    body('price')
        .trim()
        .isNumeric()
        .withMessage('Price must be a number.')
        .escape(),
    body('numberInStock')
        .trim()
        .isNumeric()
        .withMessage('Number in stock must be a number.')
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            _id: req.params.id,
        })
        if (!errors.isEmpty()) {
            const categories = await Category.find().exec()
            res.render('item_form', {
                title: 'Update Item',
                item: item,
                categories: categories,
                errors: errors.array(),
            })
            return
        } else {
            await Item.findByIdAndUpdate(req.params.id, item)
            res.redirect(item.url)
        }
    }),
]
