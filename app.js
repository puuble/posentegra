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
const path = require('path')
const _ = require('lodash')
const { getEnv, asyncForEach } = require('./bin/lib/helpers')
const TY = require('./bin/lib/ty')
const cron = require('node-cron')

app.use(express.static(path.join(__dirname, 'dist')))

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
let env = await getEnv()

async function run() {
  if (env) {
    let restaurants = env.restaurants

    restaurants = Object.keys(restaurants)
    if (Array.isArray(restaurants)) {
      if (restaurants.length > 0) {
        await asyncForEach(restaurants, async (key) => {
          let option = env.restaurants[key]

          if (_.has(option, 'ty')) {
            const ty = new TY(option['ty'])
            console.log('tyGetOrder')
            await ty.getOrder(true)
          }
        })
      }
    }
  }
}
//async function run() {}
async function main() {
  await signin(db)
  cron.schedule('*/7 * * * * *', async () => {
    console.log('7 saniye de bir run ')
    await run()
  })
}
main()
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
