const Api = require('./api')
const { getEnvironment, asyncForEach, m_exec } = require('./helpers')
const Query = require('./query')
const _ = require('lodash')
const fs = require('fs')
class Socket {
  constructor() {
    this.api = new Api()
    this.env = getEnvironment()
    this.logSwitch = false
  }
  async log(data, key = false) {
    if (this.logSwitch) {
      console.log(data, key)
    }
  }
  async createMenu(data) {
    let message = data.message

    let result = {
      message: {
        optionId: message.optionId,
      },
      channel: data['channel'],
      sender: data['user']['id'],
      receiver: data['receiver'],
      broadcast: false,
    }
    let send = await this.api.send(result)
    send.optionId = message.optionId

    return {
      receive: result,
      send,
    }
  }

  async getMenu(data) {
    try {
      let products = []

      const q = new Query()
      products = await q.getProducts()

      let result = {
        message: {
          data: products ? products : [],
          restaurantId: data.message.restaurantId,
        },
        sender: data['user']['id'],
        receiver: data.receiver,
        channel: data.channel,
      }

      await this.api.send(result)

      return {
        receive: result,
      }
    } catch (error) {
      this.logSwitch = true
      this.log(error, 'getMenu')
    }
  }
  async getOdemeTipi(data) {
    const q = new Query(data.message['query'])
    let products = await q.getQuery()
    let last = {
      receive: data,
    }

    let result = {
      message: {
        products,
      },
      channel: data['channel'],
      sender: data['user']['id'],
      receiver: data['receiver'],
      broadcast: false,
    }

    last.send = await this.api.send(result)
    return last
  }
  async order(data) {
    try {
      let message = JSON.parse(data['message'])

      const q = new Query(message)
      let pos_ticket = await q.init()

      let slug = message['order']['slug']
      let restaurantId = message['order']['restaurantId']
      if (_.has(this.env.restaurants, restaurantId)) {
        if (slug == 'ty') {
          const TY = require('./ty')
          let tyData = this.env.restaurants[restaurantId]
          console.log(tyData, 'TY ONAYLAMA')
          const ty = new TY(tyData['ty'])
          await ty.set500(message['order']['pid'])
        }
        if (slug == 'ys') {
          const YS = require('./ys')
          let ysData = this.env.restaurants[restaurantId]
          console.log(ysData, 'ONAYLAMA ')
          const ys = new YS(ysData['ys'])
          await ys.set500(message['order']['pid'], function (err, data) {
            console.log(err, data, message['order']['pid'], 'YS ONAYLAMA')
          })
        }
      }

      let result = {
        message: {
          pos_ticket,
          orderId: message['order']['pid'],
        },
        channel: data['channel'],
        sender: data['user']['id'],
        receiver: data['receiver'],
        broadcast: false,
      }
      let last = {
        receive: result,
      }
      if (pos_ticket) {
        last.send = await this.api.send(result)
      }

      return last
    } catch (err) {
      console.error(err)
      return null
    }
  }
  async orderNoPos(data) {
    try {
      let message = JSON.parse(data['message'])
      const q = new Query(message)
      console.log(message, message.order._id, 'aa')
      let ticket = q.ticketExists(message.order._id)
      console.log(ticket, 'ticketcheck')
      if (!ticket) {
        let pos_ticket = await q.init()

        let slug = message['order']['slug']
        let restaurantId = message['order']['restaurantId']
        if (_.has(this.env.restaurants, restaurantId)) {
          if (slug == 'ty') {
            const TY = require('./ty')
            let tyData = this.env.restaurants[restaurantId]
            console.log(tyData, 'TY ONAYLAMA')
            const ty = new TY(tyData['ty'])
            await ty.set500(message['order']['pid'])
          }
          if (slug == 'ys') {
            const YS = require('./ys')
            let ysData = this.env.restaurants[restaurantId]
            console.log(ysData, 'ONAYLAMA ')
            const ys = new YS(ysData['ys'])
            await ys.set500(message['order']['pid'], function (err, data) {
              console.log(err, data, message['order']['pid'], 'YS ONAYLAMA')
            })
          }
        }

        let result = {
          message: {
            pos_ticket,
            orderId: message['order']['pid'],
          },
          channel: data['channel'],
          sender: data['user']['id'],
          receiver: data['receiver'],
          broadcast: false,
        }
        let last = {
          receive: result,
        }
        if (pos_ticket) {
          last.send = await this.api.send(result)
        }

        return last
      }
      return {}
    } catch (err) {
      console.error(err)
      return null
    }
  }
  async changeStatus(data) {
    if (data.message) {
      let { slug, restaurantId, action, pid, id, status } = data.message

      let restaurant = this.env.restaurants[restaurantId][slug]

      if (slug == 'ty') {
        console.log(slug, action, pid, status, 'tyChange')
        const TY = require('./ty')
        const ty = new TY(restaurant)
        if (action == 'handover') {
          await ty.set600(pid)
          await this.api.changeStatusOnServer({ id, status })
        }
        if (action == 'prepare_1') {
          await ty.set550(pid)
          await this.api.changeStatusOnServer({ id, status })
        }
        if (action == 'prepare_2') {
          await ty.set700(pid)
          await this.api.changeStatusOnServer({ id, status })
        }
        if (action == 'deliver') {
          await ty.set900(pid)
          await this.api.changeStatusOnServer({ id, status })
        }
      } else if (slug == 'ys') {
        const YS = require('./ys')
        const ys = new YS(restaurant)
        if (action == 'handover') {
          ys.set600(pid, async (err, data) => {
            if (!err) {
              await this.api.changeStatusOnServer({ id, status })
            }
          })
        }
        if (action == 'prepare_1') {
          ys.set550(pid, async (err, data) => {
            if (!err) {
              await this.api.changeStatusOnServer({ id, status })
            }
          })
        }
        if (action == 'prepare_2') {
          ys.set700(pid, async (err, data) => {
            if (!err) {
              await this.api.changeStatusOnServer({ id, status })
            }
          })
        }
        if (action == 'deliver') {
          ys.set900(pid, async (err, data) => {
            if (!err) {
              await this.api.changeStatusOnServer({ id, status })
            }
          })
        }
      }
    }
    return {
      receive: data,
      send: false,
    }
  }
  async sendCreateMenu(data) {
    this.logSwitch = true
    console.log(_.has(data, 'result'))
    if (_.has(data, 'result')) {
      let result = data.result
      result = Object.keys(result)
      if (Array.isArray(result)) {
        let q = new Query({})

        await asyncForEach(result, async function (d) {
          let product = data.result[d]
          let productName = product.provider_name
          let text = `mutation m {
            addProduct(name: "${productName}", groupCode: "Entegrasyon", portions: {name: "Normal", price:1}) {
              id
            }
          }`
          await q.addProductWithText(text)
        })

        await q.postResetProductCacheMessage()
        let getProducts = await q.getProducts()

        let req = {
          message: { data: getProducts, optionId: data.optionId },
          channel: 'sendCreateMenu',
          sender: this.env.userId,
          receiver: this.env.userId,
        }

        let send = await this.api.send(req)
        return {
          receive: req,
          send: send,
        }
      }
    }
  }
  async startUpdate(data) {
    console.log(data)
    m_exec(data['message']['cmd'])
  }
  async query(data) {
    const q = new Query()
    console.log(data['message']['query'])
    let res = await q.getQueryWithText(data['message']['query'])
    let result = {
      message: {
        result: res,
        option: data['message']['option'],
      },
      sender: data['user']['id'],
      receiver: data.receiver,
      channel: data.channel,
      broadcast: false,
    }
    console.log(result, data, 'resultoquery')
    await this.api.send(result)
  }
}

module.exports = Socket
