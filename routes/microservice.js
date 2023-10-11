var express = require('express')
var _ = require('lodash')
const Api = require('../bin/lib/api')
var router = express.Router()

router.get('/getProviders', async function (req, res, next) {
  let id = req.query.id
  let api = new Api()
  let data = await api.getProviders()
  res.json(data)
})
router.get('/onayla', async function (req, res, next) {
  let id = req.query.id
  let api = new Api()
  let data = await api.onayla(id)

  res.json(data)
})
router.get('/sendAgain', async function (req, res, next) {
  let id = req.query.id
  let api = new Api()
  let data = await api.again(id)
  res.json(data)
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
