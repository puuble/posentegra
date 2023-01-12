const axios = require('axios')
const _ = require('lodash')
var qs = require('qs')
const asyncrequest = require('request-promise')
const moment = require('moment')
const DB = require('./database')

async function _asyncrequest(url, method = 'POST', data = {}, headers = {}) {
  var options = {
    method,
    body: data,
    json: true,
    url,
    headers,
  }

  return asyncrequest(options)
}

class Sambapos {
  constructor(env) {
    this.db = new DB()
    this.env = env
    this.access_token = null
    this.expires = null
  }
  async getToken(field) {
    return await this.db.getField(field)
  }
  async query(q) {
    const url = `${this.url}/api/graphql`
    let response = await _asyncrequest(url, 'POST', q, {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.access_token,
    })

    return response
  }
  async refresh() {
    this.url = `http://${this.env.pos.host}:${this.env.pos.port}`
    if (this.env) {
      this.access_token = null
      let url = `${this.url}/Token`
      let response = await _asyncrequest(
        url,
        'POST',
        qs.stringify({
          grant_type: 'refresh_token',
          username: this.env.pos.username,
          client_id: this.env.pos.client_id,
          refresh_token: await this.getToken('refresh_token'),
          client_secret: 'test',
        }),
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      ).catch((err) => {
        console.log(err)
        console.log('ERROR SAMBA REFRESG')
      })

      if (response) {
        if (_.has(response, 'access_token')) {
          this.db.access_token(response.access_token)

          this.access_token = response.access_token
        }
        if (_.has(response, 'refresh_token')) {
          this.db.refresh_token(response.refresh_token)
        }
        if (_.has(response, 'expires_in')) {
          this.db.expires(moment(response['.expires']).toISOString())
        }
      } else {
        this.access_token = await this.login()
      }

      return this.access_token
    }

    return false
  }
  async login() {
    this.url = `http://${this.env.pos.host}:${this.env.pos.port}`
    if (this.env) {
      let url = `${this.url}/Token`
      let response = await _asyncrequest(
        url,
        'POST',
        qs.stringify({
          grant_type: 'password',
          username: this.env.pos.username,
          password: this.env.pos.password,
          client_id: this.env.pos.client_id,
        }),
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      ).catch((err) => {
        console.log(err, 'ERROR SAMBA LOGIN')
      })

      if (response) {
        console.log(response, 'login')
        if (_.has(response, 'refresh_token')) {
          this.db.refresh_token(response.refresh_token)
        }
        if (_.has(response, 'access_token')) {
          this.db.refresh_token(response.access_token)
          this.access_token = response.access_token
        }
        if (_.has(response, 'expires_in')) {
          this.db.expires(moment(response['.expires']).toISOString())
        }
      } else {
        console.log('SAMBAPOS login problem')
      }

      return this.access_token
    } else {
      return false
    }
  }
  async authCheck() {
    console.log(this.env, 'this')
    this.url = `http://${this.env.pos.host}:${this.env.pos.port}`
    if (this.env) {
      let expires = await this.getToken('expires')

      if (expires) {
        let a = moment(expires)
        let diff = moment(moment(a)).diff(moment(), 'minutes')

        if (diff <= 0) {
          this.access_token = await this.refresh()
        }
      } else {
        this.access_token = await this.refresh()
      }

      return this.access_token
    } else {
      return false
    }
  }
}
module.exports = Sambapos