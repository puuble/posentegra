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
  let trigger = await _asyncrequest(
    '/api/authenticateWithToken',
    'POST',
    { token: req.body.token },
    {}
  ).catch((e) => {
    req.session.fail = true
    //console.log(e)
    // return res.redirect(301, '/')
  })

  if (!trigger) {
    req.session.fail = true
    return res.json(trigger)
  }

  if (_.has(trigger, 'success')) {
    req.session.loggedin = true
    req.session.fail = false
    req.session.token = req.body.token
    db.dbToken(trigger.data['token'])
    db.enviroment(JSON.stringify(trigger.data))
    return res.json(trigger)
  } else {
    req.session.fail = true
    return res.json({ success: false })
  }
})
router.get('/login', async function (req, res, next) {
  let token = await db.getDBToken()
  if (token == null) {
    res.json({ success: false })
  } else {
    let trigger = await _asyncrequest(
      '/api/authenticateWithToken',
      'POST',
      { token },
      {}
    ).catch((e) => {
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
  let api = new Api()
  let data = await api.loadDetail(id)
  res.json({ success: true, id, data })
})
router.get('/getReasons', async function (req, res, next) {
  let id = req.query.id
  let api = new Api()
  let data = await api.getReasons(id)
  res.json(data)
})
router.post('/updateRestaurantStatus', async function (req, res, next) {
  let id = req.body.provider
  let status = req.body.on
  let field = req.body.field //otomatikOnay ||status
  let api = new Api()
  let data = await api.updateRestaurantStatus(id, status, field)
  res.json(data)
})
router.get('/onayla', async function (req, res, next) {
  let id = req.query.id
  let api = new Api()
  let data = await api.onayla(id)
  res.json(data)
})
router.get('/getProviders', async function (req, res, next) {
  let id = req.query.id
  let api = new Api()
  let data = await api.getProviders()
  res.json(data)
})
router.get('/saveReason', async function (req, res, next) {
  let reason = req.query.reason
  let id = req.query.id
  let api = new Api()
  let data = await api.saveReason(reason, id)
  res.json(data)
})
router.get('/getOrders', async function (req, res, next) {
  let env = await getEnv()
  let fail = req.session.fail
  let orders = []
  if (fail) {
    req.session.fail = false
  }

  if (env) {
    if (_.has(env, 'token')) {
      let api = new Api()
      orders = await api.getOrders()
    }
  }

  res.json(orders)
})

module.exports = router
