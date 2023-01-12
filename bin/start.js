const { getEnvironment, _asyncrequest } = require('./lib/helpers')
const PusherClient = require('./lib/pusher')
const Query = require('./lib/query')
const Sambapos = require('./lib/sambapos')
const pusher = new PusherClient()
const sambapos = new Sambapos()
const query = new Query()

async function signin(db) {
  let env = await getEnvironment()
  let token = await db.getDBToken()
  let trigger = await _asyncrequest('/api/authenticateWithToken', 'POST', { token }, {}).catch((e) => {
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
  }
}

module.exports = {
  signin,
}
