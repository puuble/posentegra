const { getEnvironment } = require('./lib/helpers')
const PusherClient = require('./lib/pusher')
const pusher = new PusherClient()

async function signin() {
  let env = getEnvironment()
  if (env) {
    await pusher.connect()
  }
}

module.exports = {
  signin,
}
