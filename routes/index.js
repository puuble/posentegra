var express = require('express')

const Api = require('../bin/lib/api')
const DB = require('../bin/lib/database')
const TY = require('../bin/lib/ty')
const { getEnv, _asyncrequest, m_exec } = require('../bin/lib/helpers')
var router = express.Router()
const db = new DB()
async function changeStatus(result) {
  let env = await getEnvironment()

  let sonuc = await _asyncrequest(`/api/changeStatus`, 'POST', result, {
    Authorization: 'Bearer ' + env.token,
  }).catch((e) => console.log('SERVERDAN'))

  console.log(sonuc, result, 'changeStatus')

  return sonuc ? sonuc.success : false
}
router.post('/changeStatus', async (req, res, next) => {
  try {
    const env = await getEnvironment()
    let result = null
    let status = req.body.status
    let deliveryType = req.body.deliveryType
    let provider = req.body.provider
    let pid = req.body.pid
    let restaurantId = req.body.restaurantId
    let restaurant = env.restaurants[restaurantId][provider]

    const ty = new TY(restaurant.integration)
    const ys = new YS(restaurant, 2)
    if (provider == 'getir') {
      result = await _asyncrequest(
        `/api/changeStatus`,
        'POST',
        req.body,
        {
          Authorization: 'Bearer ' + env.token,
          'Content-Type': 'application/json',
        },
        process.env.SERVER
      ).catch((err) => {
        console.log(err.message, 'SERVERDAN')
        return res.status(200).send({ waiting: true, success: false })
      })
    } else if (provider == 'ty') {
      let m = false

      if (deliveryType == 2) {
        if (status == 700) {
          m = await ty.set900(pid)
          if (m) {
            req.body.status = 900
            await changeStatus(req.body)
          }
        } else if (status == 400) {
          m = await ty.set500(pid)
          if (m) {
            req.body.status = 500
            console.log('5000 e geldi')
            await changeStatus(req.body)
          }
        } else if (status != 900) {
          m = await ty.set700(pid)
          if (m) {
            req.body.status = 700
            await changeStatus(req.body)
          }
        }
      } else {
        if (status != 550) {
          m = await ty.set550(pid)
          if (m) {
            req.body.status = 550
            await changeStatus(req.body)
          }
        }
      }
      console.log(m)
    }

    return res.status(200).send({ success: true, body: req.body })
  } catch (error) {
    console.log(error)
  }
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

module.exports = router
