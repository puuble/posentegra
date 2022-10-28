const { getEnvironment, _asyncrequest } = require('./helpers')
const _ = require('lodash')
class Api {
  constructor() {
    this.env = getEnvironment()
    this.logSwitch = false
  }
  async log(data, key = false) {
    if (this.logSwitch) {
      console.log(data, key)
    }
  }

  async send(req) {
    try {
      let result = await _asyncrequest('/api/trigger', 'POST', req, {
        Authorization: 'Bearer ' + this.env.token,
      }).catch((e) => console.log('SERVERDAN', e.message))
      if (!result) {
        console.log('undefined result')
      }
      return result
    } catch (error) {
      console.log(error, 'api.send')
    }
  }
  async changeStatusOnServer(req) {
    try {
      let result = await _asyncrequest('/api/changeStatus', 'POST', req, {
        Authorization: 'Bearer ' + this.env.token,
      }).catch((e) => console.log('SERVERDAN', e.message))
      return result
    } catch (error) {
      console.log(error, 'api.send')
    }
  }
}

module.exports = Api