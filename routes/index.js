var express = require('express')

const Api = require('../bin/lib/api')
const DB = require('../bin/lib/database')
const { getEnv, _asyncrequest, m_exec } = require('../bin/lib/helpers')
var router = express.Router()
const db = new DB()

router.get('/sendAgain', async function (req, res) {
  let env = await getEnvironment()
  let sonuc = false
  if (req.query.id) {
    sonuc = await _asyncrequest(
      '/api/again?id=' + req.query.id,
      'GET',
      {},
      {
        Authorization: 'Bearer ' + env.token,
      }
    ).catch((e) => console.log('SERVERDAN', e))
  }

  return res.json(sonuc)
})
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
router.get('/raporGonder', async (req, res, next) => {
  try {
    const env = await getEnvironment()
    let api = new Api()
    console.log(req.query.name)
    let frm = {
      message: {
        name: req.query.name,
      },
      channel: 'raporGonder',
      sender: env.userId,
      receiver: env.userId,
      broadcast: true,
    }
    console.log(frm)
    await api.send(frm)
    return res.json({ success: true })
  } catch (error) {
    console.log(error)
  }
})
router.get('/tarihGonder', async (req, res, next) => {
  let id = req.query.id

  if (id) {
    const env = await getEnvironment()
    let api = new Api()
    let query = new Query()

    let frm = {
      message: {
        id,
      },
      channel: 'tarihGonder',
      sender: env.userId,
      receiver: env.userId,
      broadcast: false,
    }

    let send = await api.send(frm)
    let q = `mutation m1 {
          postBroadcastMessage(message: "ENT- Wp Gönder - ${send.result.samba_id}") {
            message
          }
        }`
    await query.getQueryWithText(q)
    return res.json({ success: true })
  }

  res.json({ success: true })
})

router.get('/raporGonder', async (req, res, next) => {
  try {
    const env = await getEnvironment()
    let api = new Api()
    console.log(req.query.name)
    let frm = {
      message: {
        name: req.query.name,
      },
      channel: 'raporGonder',
      sender: env.userId,
      receiver: env.userId,
      broadcast: true,
    }
    console.log(frm)
    await api.send(frm)
    return res.json({ success: true })
  } catch (error) {
    console.log(error)
  }
})
router.get('/tarihGonder', async (req, res, next) => {
  let id = req.query.id

  if (id) {
    const env = await getEnvironment()
    let api = new Api()
    let query = new Query()

    let frm = {
      message: {
        id,
      },
      channel: 'tarihGonder',
      sender: env.userId,
      receiver: env.userId,
      broadcast: false,
    }

    let send = await api.send(frm)
    let q = `mutation m1 {
          postBroadcastMessage(message: "ENT- Wp Gönder - ${send.result.samba_id}") {
            message
          }
        }`
    await query.getQueryWithText(q)
    return res.json({ success: true })
  }

  res.json({ success: true })
})
module.exports = router
