const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
require('dotenv').config()
const indexRouter = require('./routes/index')
const itemRouter = require('./routes/item')
const categoryRouter = require('./routes/category')
const compression = require('compression')
const mongoose = require('mongoose')
const helmet = require('helmet')
const app = express()

const RateLimit = require('express-rate-limit')
const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
})

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

app.use(limiter)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(compression())
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net'],
        },
    })
)
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/category', categoryRouter)
app.use('/item', itemRouter)

module.exports = app
