const { getEnvironment } = require('./lib/helpers')
const PusherClient = require('./lib/pusher')
const Query = require('./lib/query')
const Sambapos = require('./lib/sambapos')
const pusher = new PusherClient()
const sambapos = new Sambapos()
const query = new Query()

async function signin() {
  let env = getEnvironment()
  if (env) {
    let products = await query.getProducts()
    console.log(products, 'sambapos check ')
    await sambapos.authCheck()
    await pusher.connect()
  }
}

module.exports = {
  signin,
}
