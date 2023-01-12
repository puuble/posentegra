var express = require('express')
var _ = require('lodash')
const Api = require('../bin/lib/api')
const DB = require('../bin/lib/database')
const { getEnv, _asyncrequest, m_exec } = require('../bin/lib/helpers')
var router = express.Router()
const db = new DB()
const fs = require('fs')

router.post('/token', async function (req, res, next) {
  let token = req.body.token
  let fail = req.session.fail
  let trigger = await _asyncrequest('/api/authenticateWithToken', 'POST', { token: req.body.token }, {}).catch((e) => {
    req.session.fail = true
    // console.log(e)
    // return res.redirect(301, '/')
  })

  if (!trigger) {
    req.session.fail = true
  }
  console.log(trigger)
  if (trigger) {
    req.session.loggedin = true
    req.session.fail = false
    req.session.token = req.body.token
    db.dbToken(trigger.data['token'])
    db.enviroment(JSON.stringify(trigger.data))
    //m_exec('pm2 restart all')
  } else {
    req.session.fail = true
  }

  res.json(trigger)
})
router.get('/login', async function (req, res, next) {
  let token = await db.getDBToken()
  if (token == null) {
    res.json({ success: false })
  } else {
    let trigger = await _asyncrequest('/api/authenticateWithToken', 'POST', { token }, {}).catch((e) => {
      req.session.fail = true
      //console.log(e)
      // return res.redirect(301, '/')
    })
    if (!trigger) {
      req.session.fail = true
      trigger.success = false
    }

    if (trigger.success) {
      req.session.loggedin = true
      req.session.fail = false
      req.session.token = req.body.token
      db.enviroment(JSON.stringify(trigger.data))
      //m_exec('pm2 restart all')
    } else {
      req.session.fail = true
    }
    res.json(trigger)
  }
})
router.get('/getDetail', async function (req, res, next) {
  let id = req.query.id

  let html = fs.readFileSync('./detail.html', { encoding: 'utf8', flag: 'r' })

  res.json({ success: true, id, html })
})
router.get('/getOrders', async function (req, res, next) {
  let env = await getEnv()
  let fail = req.session.fail
  let orders = []
  if (fail) {
    req.session.fail = false
  }

  console.log(env['token'], 'env')
  if (env) {
    if (_.has(env, 'token')) {
      let api = new Api()
      orders = await api.getOrders()
      console.log(orders)
    }
  }

  res.json(orders)
})

module.exports = router
