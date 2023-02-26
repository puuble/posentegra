var express = require('express')

const Api = require('../bin/lib/api')
const DB = require('../bin/lib/database')
const { getEnv, _asyncrequest, m_exec } = require('../bin/lib/helpers')
var router = express.Router()
const db = new DB()

router.get('/odemeTipiGonder', async (req, res, next) => {
  let env = await getEnv()
  let result = {
    channel: 'getOdemeTipi',
    message: { ot: req.query.ot },
    sender: env.userId,
    receiver: env.userId,
  }
  let sonuc = await _asyncrequest('/api/trigger', 'POST', result, {
    Authorization: 'Bearer ' + env.token,
  }).catch((e) => console.log('SERVERDAN'))
  console.log(sonuc, 'SERVERDAN')

  return res.json({ success: true })
})
module.exports = router
