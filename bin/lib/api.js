const { getEnvironment, _asyncrequest, sendFormData, sendFileWithBody } = require('./helpers')
const _ = require('lodash')
const fs = require('fs')
class Api {
  constructor() {
    this.env = null
    this.logSwitch = false
  }

  async log(data, key = false) {
    if (this.logSwitch) {
      console.log(data, key)
    }
  }
  async sendRequest(route, req) {
    try {
      this.env = await getEnvironment()
      let result = await _asyncrequest(route, 'POST', req, {
        Authorization: 'Bearer ' + this.env.token,
      }).catch((e) => console.log('SERVERDAN', e.message))
      if (!result) {
        console.log('undefined result')
      }
      return result
    } catch (error) {
      console.log(error, 'api.sendRequest')
    }
  }
  async sendFile(formData, body) {
    const SERVER = process.env.SERVER
    let url = '/api/trigger'

    try {
      this.env = await getEnvironment()
      await sendFileWithBody(SERVER + url, 'POST', formData, body, {
        Authorization: 'Bearer ' + this.env.token,
      }).catch((e) => console.log('SERVERDAN', e.message))
    } catch (error) {
      console.log(error, 'sendFile')
    }
  }
  async send(req) {
    try {
      this.env = await getEnvironment()
      fs.writeFileSync(req.channel + '.json', JSON.stringify(req))
      let result = await _asyncrequest('/api/trigger', 'POST', req, {
        Authorization: 'Bearer ' + this.env.token,
      }).catch((e) => console.log('SERVERDAN', e.message))
      if (!result) {
        console.log('undefined result')
      }
      console.log(result, 'resultApi')
      return result
    } catch (error) {
      console.log(error, 'api.send')
    }
  }
  async changeStatusOnServer(req) {
    try {
      this.env = await getEnvironment()
      let result = await _asyncrequest('/api/changeStatus', 'POST', req, {
        Authorization: 'Bearer ' + this.env.token,
      }).catch((e) => console.log('SERVERDAN', e.message))
      return result
    } catch (error) {
      console.log(error, 'api.send')
    }
  }
  async getRestaurants() {
    try {
      this.env = await getEnvironment()
      let result = await _asyncrequest(
        '/api/user/restaurants',
        'GET',
        {},
        {
          Authorization: 'Bearer ' + this.env.token,
        }
      ).catch((e) => console.log('SERVERDAN', e.message))
      if (!result.success) {
        return []
      }
      return result.data
    } catch (error) {
      console.log(error, 'api.send')
    }
  }
  async getOrders() {
    try {
      this.env = await getEnvironment()
      let result = await _asyncrequest(
        '/api/orders',
        'GET',
        {},
        {
          Authorization: 'Bearer ' + this.env.token,
        }
      ).catch((e) => console.log('SERVERDAN', e.message))

      if (!result.success) {
        return []
      }
      return result.data
    } catch (error) {
      console.log(error, 'api.send')
    }
  }
  async loadDetail(id) {
    try {
      this.env = await getEnvironment()
      let result = await _asyncrequest(
        '/api/orderDetail/' + id,
        'GET',
        {},
        {
          Authorization: 'Bearer ' + this.env.token,
        }
      ).catch((e) => console.log('SERVERDAN', e.message))

      return result
    } catch (error) {
      console.log(error, 'api.send')
    }
  }
  async getReasons(id) {
    try {
      this.env = await getEnvironment()
      let result = await _asyncrequest(
        '/api/getReasons/' + id,
        'GET',
        {},
        {
          Authorization: 'Bearer ' + this.env.token,
        }
      ).catch((e) => console.log('SERVERDAN', e.message))

      return result
    } catch (error) {
      console.log(error, 'api.send')
    }
  }
  async onayla(id) {
    try {
      this.env = await getEnvironment()
      let result = await _asyncrequest(
        '/api/order/verify/' + id,
        'GET',
        {},
        {
          Authorization: 'Bearer ' + this.env.token,
        }
      ).catch((e) => console.log('SERVERDAN', e.message))

      return result
    } catch (error) {
      console.log(error, 'api.send')
    }
  }
  async getProviders() {
    try {
      this.env = await getEnvironment()
      let result = await _asyncrequest(
        '/api/restaurant/getProviders',
        'GET',
        {},
        {
          Authorization: 'Bearer ' + this.env.token,
        }
      ).catch((e) => console.log('SERVERDAN', e.message))

      return result
    } catch (error) {
      console.log(error, 'api.send')
    }
  }
  async saveReason(reason, id) {
    try {
      this.env = await getEnvironment()
      let result = await _asyncrequest(
        '/api/orderCancel/' + id,
        'POST',
        {
          reason,
        },
        {
          Authorization: 'Bearer ' + this.env.token,
        }
      ).catch((e) => console.log('SERVERDAN', e.message))

      return result
    } catch (error) {
      console.log(error, 'api.send')
    }
  }
  async updateRestaurantStatus(providerId, status, field) {
    try {
      this.env = await getEnvironment()
      let result = await _asyncrequest(
        '/api/restaurant/updateStatus',
        'POST',
        {
          providerId, //providerId
          status,
          field,
        },
        {
          Authorization: 'Bearer ' + this.env.token,
        }
      ).catch((e) => console.log('SERVERDAN', e.message))
      console.log(result, 'mm')
      return result
    } catch (error) {
      console.log(error, 'api.send')
    }
  }
}

module.exports = Api
