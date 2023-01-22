const Pusher = require('pusher')

const pusher = new Pusher({
  appId: '1535255',
  key: '4e51696222bfa2ffd7fa',
  secret: 'acb749b81268c66e158d',
  cluster: 'eu',
  useTLS: true,
})

pusher.trigger('my-channel', 'my-event', {
  message: 'hello world',
})
