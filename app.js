require('dotenv').config()
const express = require('express')
var logger = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT
var indexRouter = require('./routes/index')
var ajaxRouter = require('./routes/ajax')
const session = require('express-session')
const DB = require('./bin/lib/database')
const { signin } = require('./bin/start')

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

app.use(cors()) // to allow cross origin requests
app.use(bodyParser.json()) // to convert the request into JSON
app.use('/', indexRouter)
app.use('/api/ajax', ajaxRouter)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`)
})
