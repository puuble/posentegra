var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var ajaxRouter = require('./routes/ajax')
const session = require('express-session')
const DB = require('./bin/lib/database')
const { signin } = require('./bin/start')

var app = express()
app.use(
  session({
    secret: '!posentegra!',
    resave: true,
    saveUninitialized: true,
  })
)
const DBSOURCE = 'temp.db'
let db = new DB()
db.dbCheck(DBSOURCE)
async function run() {
  await signin(db)
}
run()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules')))

app.use('/', indexRouter)
app.use('/ajax', ajaxRouter)

module.exports = app
