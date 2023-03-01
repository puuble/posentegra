const { getEnvironment, _asyncrequest, asyncForEach } = require('./lib/helpers')
const PusherClient = require('./lib/pusher')
const Query = require('./lib/query')
const Sambapos = require('./lib/sambapos')
const pusher = new PusherClient()
const query = new Query()
const cron = require('node-cron')
const TY = require('./lib/ty')

async function run(env) {
  if (env) {
    let restaurants = env.restaurants

    restaurants = Object.keys(restaurants)
    console.log(restaurants, 'aa')
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

async function signin(db) {
  let env = await getEnvironment()
  const sambapos = new Sambapos()
  let token = await db.getDBToken()
  let trigger = await _asyncrequest(
    '/api/authenticateWithToken',
    'POST',
    { token },
    {}
  ).catch((e) => {
    console.log('token kontrol et')
  })
  if (trigger) {
    if (trigger.success) {
      env = JSON.stringify(trigger.data)
      db.enviroment(env)
    }
  }

  if (env) {
    await sambapos.authCheck()
    await pusher.connect()
    let products = await query.getProducts()
    console.log(products, 'sambapos check ')
    cron.schedule('*/7 * * * * *', async () => {
      console.log('7 saniye de bir run')
      env = JSON.parse(env)
      console.log(env)
      await run(env)
    })
  }
}

module.exports = {
  signin,
}
