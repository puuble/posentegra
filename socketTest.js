const { getEnvironment } = require('./bin/lib/helpers')
const PusherClient = require('./bin/lib/pusher')
const pusher = new PusherClient()

async function main() {
  await pusher.connect()
}
main()
