var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')

const mongoose = require('mongoose')

var app = express()

mongoose.set('strictQuery', false)

const dev_db_url =
    'mongodb+srv://hmizitamim:1007@cluster0.4litlil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const mongoDB = process.env.MONGODB_URI || dev_db_url

main().catch((err) => console.log(err))
async function main() {
    await mongoose.connect(mongoDB)
}

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

module.exports = app
