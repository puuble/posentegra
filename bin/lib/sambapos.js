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
const db = new DB()

class Sambapos {
  constructor() {
    this.db = db
    this.env = null
    this.access_token = null
    this.expires = null
  }
  async getToken(field) {
    return await this.db.getField(field)
  }
  async query(q) {
    this.env = await db.getField('enviroment')
    this.url = `http://${this.env.pos.host}:${this.env.pos.port}`

    const url = `${this.url}/api/graphql`
    let response = await _asyncrequest(url, 'POST', q, {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.access_token,
    })

    return response
  }
  async refresh() {
    try {
      this.env = await db.getField('enviroment')
      this.url = `http://${this.env.pos.host}:${this.env.pos.port}`
      if (this.env) {
        console.log('REFRESH env var ')
        this.access_token = null
        let url = `${this.url}/Token`
        console.log('REFRESH KONTROL', await this.getToken('refresh_token'))
        let response = await _asyncrequest(
          url,
          'POST',
          qs.stringify({
            grant_type: 'refresh_token',
            username: this.env.pos.username,
            client_id: this.env.pos.client_id,
            refresh_token: await this.getToken('refresh_token'),
            client_secret: this.env.pos.password,
          }),
          { 'Content-Type': 'application/x-www-form-urlencoded' }
        ).catch(async (err) => {
          console.log('ERRor VAR ', err)
          this.access_token = await this.login()
          console.log('SAMBA REFRESH YAPILIYOR')
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
    } catch (error) {
      this.access_token = await this.login()
    }

    return false
  }
  async login() {
    console.log('LOGIN YAPIYOR')
    this.env = await db.getField('enviroment')
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
          client_secret: this.env.pos.password,
        }),
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      ).catch((err) => {
        console.log(err, 'ERROR SAMBA LOGIN')
      })

      if (response) {
        console.log(response, 'karakutu')
        if (_.has(response, 'refresh_token')) {
          this.db.refresh_token(response.refresh_token)
        }
        if (_.has(response, 'access_token')) {
          console.log(response.access_token, 'access_token')
          this.db.access_token(response.access_token)
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
    this.env = await db.getField('enviroment')
    this.url = `http://${this.env.pos.host}:${this.env.pos.port}`

    console.log('AUTH YAPILIYOR')
    if (this.env) {
      console.log('ENV')
      let expires = await this.getToken('expires')
      console.log(expires, 'EXPIRES')
      this.access_token = await db.getField('access_token')
      console.log(this.access_token, 'access_token')
      if (this.access_token == 'null') {
        console.log('ACCESS TOKEN NULL')
        this.access_token = await this.refresh()
      }
      if (expires) {
        let a = moment(expires)
        let diff = moment(moment(a)).diff(moment(), 'minutes')

        if (diff <= 0) {
          this.access_token = await this.refresh()
        }
      } else {
        this.access_token = await this.refresh()
      }

      console.log(this.access_token, expires, 'accttt')
      await db.access_token(this.access_token)
      return this.access_token
    } else {
      console.log('env alinmadi')
      return false
    }
  }
}
module.exports = Sambapos
