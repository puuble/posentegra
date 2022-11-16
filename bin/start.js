const { getEnvironment } = require('./lib/helpers')
const PusherClient = require('./lib/pusher')
const Sambapos = require('./lib/sambapos')
const pusher = new PusherClient()
const sambapos = new Sambapos()
async function signin() {
  let env = getEnvironment()
  if (env) {
    console.log('sambapos check ')
    await sambapos.authCheck()
    await pusher.connect()
  }
}

module.exports = {
  signin,
}
