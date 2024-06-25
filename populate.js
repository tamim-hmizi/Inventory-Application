#! /usr/bin/env node
const userArgs = process.argv.slice(2)

const Item = require('./models/item')
const Category = require('./models/category')

const items = []
const categories = []

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const mongoDB = userArgs[0]

main().catch((err) => console.log(err))

async function main() {
    await mongoose.connect(mongoDB)

    await createCategories()
    await createItems()

    mongoose.connection.close()
}

async function categoryCreate(index, name, description) {
    const category = new Category({ name, description })
    category.save()
    categories[index] = category
}

async function itemCreate(
    index,
    name,
    description,
    category,
    price,
    numberInStock
) {
    const item = new Item({ name, description, category, price, numberInStock })
    await item.save()
    items[index] = item
}

async function createCategories() {
    await Promise.all([
        categoryCreate(0, 'category one', 'category one desc'),
        categoryCreate(1, 'category two', 'category two desc'),
        categoryCreate(2, 'category three', 'category three desc'),
    ])
}

async function createItems() {
    await Promise.all([
        itemCreate(0, 'item 0', 'item 0 desc', categories[0], 10, 1),
        itemCreate(1, 'item 1', 'item 1 desc', categories[0], 20, 10),
        itemCreate(2, 'item 2', 'item 2 desc', categories[0], 30, 100),
        itemCreate(3, 'item 3', 'item 3 desc', categories[1], 40, 1000),
        itemCreate(4, 'item 4', 'item 4 desc', categories[1], 50, 10000),
        itemCreate(5, 'item 5', 'item 5 desc', categories[1], 60, 100000),
        itemCreate(6, 'item 6', 'item 6 desc', categories[2], 70, 1000000),
        itemCreate(7, 'item 7', 'item 7 desc', categories[2], 80, 10000000),
        itemCreate(8, 'item 8', 'item 8 desc', categories[2], 90, 100000000),
        itemCreate(9, 'item 9', 'item 9 desc', categories[2], 100, 1000000000),
    ])
}
