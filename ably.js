const Ably = require('ably')
const ably = new Ably.Realtime.Promise('0RnkGA.ikS1HA:YHlgi5j1wQ_xGTfpn51LovPnf4qPffUR1r4RuoEml5c')

async function main() {
  await ably.connection.once('connected')
  console.log('Connected to Ably!')
  const channel = ably.channels.get('my-channel')

  await channel.subscribe('my-event', (message) => {
    console.log('Received a greeting message in realtime: ' + message.data)
  })
  //await channel.publish('greeting', 'hello!')
}

async function pub() {}
main()
