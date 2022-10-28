require('dotenv').config()
var express = require('express')
var router = express.Router()
const { _asyncrequest } = require('../bin/lib/helpers')
const YS = require('../bin/lib/ys')
const TY = require('../bin/lib/ty')
const fs = require('fs')

async function getEnvironment() {
  try {
    const data = fs.readFileSync('./tmp/enviroment.json', 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error(err)
  }
}
async function fileExists(path) {
  try {
    if (fs.existsSync(path)) {
      //file exists
      return true
    }
  } catch (err) {
    console.error(err)
  }

  return false
}
async function login(token) {
  let status = false
  console.log(token, 'loggin')
  let trigger = await _asyncrequest(
    '/api/authenticateWithToken',
    'POST',
    { token },
    {}
  ).catch((e) => {
    console.log(e, 'undefined')
    status = false
  })
  console.log(trigger, 'trigger')

  return trigger ? trigger.success : false
}
async function changeStatus(result) {
  let env = await getEnvironment()

  let sonuc = await _asyncrequest(`/api/changeStatus`, 'POST', result, {
    Authorization: 'Bearer ' + env.token,
  }).catch((e) => console.log('SERVERDAN'))

  console.log(sonuc, result, 'changeStatus')

  return sonuc ? sonuc.success : false
}
/* GET home page. */
router.get('/', async function (req, res, next) {
  let fail = req.session.fail
  if (fail) {
    req.session.fail = false
  }
  let connected = true
  if (req.session.loggedin || (await fileExists('./tmp/enviroment.json'))) {
    let env = await getEnvironment()
    let token = env.token
    if (token != '') {
      if (!(await login(token))) {
        res.render('login', { fail: true })
      } else {
        try {
          console.log('buraya geliyor mu', connected)
          if (req.session.token) {
            try {
              /*fs.writeFileSync(
                    './tmp/enviroment.json',
                    JSON.stringify({ token: req.session.token })
                  )*/
              // file written successfully
            } catch (err) {
              console.error(err)
            }
          }
        } catch (error) {
          console.log(error, 'AA')
        }
        let sonuc = await _asyncrequest(
          '/api/orders',
          'GET',
          {},
          {
            Authorization: 'Bearer ' + env.token,
          }
        ).catch((e) => console.log('SERVERDAN', e))

        if (sonuc) {
          sonuc = sonuc['data']
        }

        res.render('index', {
          title: 'Posentegra',
          PUSHER_APP_KEY: process.env['PUSHER_APP_KEY'],
          USER_ID: env.userId,
          SERVER: process.env['SERVER'],
          enviroment: env,
          connected,
          orders: sonuc,
        })
      }
    }
    res.render('login', { fail })
  } else {
    res.render('login', { fail })
  }
})
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
router.post('/update', async (req, res) => {
  console.log(req.body.token)
  let trigger = await _asyncrequest(
    '/api/authenticateWithToken',
    'POST',
    { token: req.body.token },
    {}
  ).catch((e) => {
    req.session.fail = true
    //console.log(e)
    //return res.redirect(301, '/')
  })

  if (!trigger) {
    req.session.fail = true
  }

  if (trigger.success) {
    req.session.loggedin = true
    req.session.token = req.body.token
    fs.writeFileSync('./tmp/enviroment.json', JSON.stringify(trigger.data))
  } else {
    req.session.fail = true
  }

  return res.redirect(301, '/')
})

router.get('/odemeTipiGonder', async (req, res, next) => {
  let env = await getEnvironment()
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
})
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
    } else if (provider == 'ys') {
      if (deliveryType == 2) {
        if (status == 700) {
          //900
          await ys.set900(pid, async (err, data) => {
            if (!err) {
              req.body.status = 900
              await changeStatus(req.body)
            }
          })
        } else if (status == 400) {
          await ys.set500(pid, async (err, data) => {
            if (!err) {
              req.body.status = 500
              await changeStatus(req.body)
            }
          })
        } else if (status != 900) {
          //700
          await ys.set700(pid, async (err, data) => {
            if (!err) {
              req.body.status = 700
              await changeStatus(req.body)
            }
          })
        }
      } else {
        if (status != 550) {
          req.body.status = 550
          await changeStatus(req.body)
        }
      }
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
module.exports = router
