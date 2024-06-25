const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const indexRouter = require('./routes/index')
const itemRouter = require('./routes/item')
const categoryRouter = require('./routes/category')

const mongoose = require('mongoose')

const app = express()

mongoose.set('strictQuery', false)

const dev_db_url =
    'mongodb+srv://hmizitamim:1007@cluster0.4litlil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const mongoDB = process.env.MONGODB_URI || dev_db_url

main().catch((err) => console.log(err))
async function main() {
    await mongoose.connect(mongoDB)
}

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/category', categoryRouter)
app.use('/item', itemRouter)

module.exports = app
