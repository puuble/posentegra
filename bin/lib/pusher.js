require('dotenv').config()
const Pusher = require('pusher-js')
const axios = require('axios')
const fs = require('fs')
const _ = require('lodash')
const { getEnvironment, _asyncrequest } = require('./helpers')
const Socket = require('./socket')
const DB = require('./database')
const SERVER = process.env.SERVER
class PusherClient {
  constructor() {
    this.pusher = new Pusher(process.env.PUSHER_APP_KEY, {
      cluster: 'eu',
      authEndpoint: '/api/broadcasting/auth',
      authorizer: (channel, options) => {
        return {
          authorize: (socketId, callback) => {
            axios
              .post(SERVER + '/api/broadcasting/auth', {
                socket_id: socketId,
                channel_name: channel.name,
                options,
              })
              .then((response) => {
                console.log(response.data, 'response')
                callback(false, response.data)
              })
              .catch((error) => {
                callback(true, error)
              })
          },
        }
      },
    })
  }
  async connect() {
    try {
      this.env = await getEnvironment()
      if (this.env) {
        if (_.has(this.env, 'userId')) {
          let connected = false
          let channel = `private-trigger.${this.env.userId}`
          let event = 'Trigger'
          let channelUser = this.pusher.subscribe(channel)

          channelUser.bind('pusher:subscription_succeeded', async () => {
            connected = true
            console.log('baglandi', channel, connected)
            channelUser.trigger('client-connected', {
              connected,
            })
          })

          channelUser.bind(event, async (data) => {
            await this.sendData(data)
          })
          channelUser.bind_global(function (data) {
            console.log(data, channel, 'a')
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  async sendData(data) {
    let socket = new Socket()
    let channel = data.channel
    console.log(channel, 'channelName')
    //if (channel != 'order') {
    if (typeof socket[channel] === 'function') {
      let result = await socket[channel](data)
      if (_.has(result, 'send')) {
        let send = result.send

        fs.writeFileSync('./logs/' + channel + '.json', JSON.stringify(result))

        let resultChannel = send.channel
        if (typeof socket[resultChannel] === 'function') {
          await socket[send.channel](send)
        }
      }
    } else {
      console.log('channel yok')
    }
    //}
  }
}

module.exports = PusherClient
