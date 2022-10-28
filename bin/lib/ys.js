require('dotenv').config()
var convert = require('xml-js')
const axios = require('axios')
const fs = require('fs')
const _ = require('lodash')

const { asyncForEach, _asyncrequest, getEnvironment } = require('./helpers')

async function changeStatus(orderId, body, status = 'Approved', cb) {
  //Approved or Accepted or Rejected or Cancelled or OnDelivery or Delivered or TechnicalRejected
  let xlms = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Header>
        <AuthHeader xmlns="http://tempuri.org/">
        <UserName>${body.integration['username']}</UserName>
        <Password>${body.integration['password']}</Password>
        </AuthHeader>
      </soap12:Header>
      <soap12:Body>
      <UpdateOrderV2 xmlns="http://tempuri.org/">
      <orderId>${orderId}</orderId>
      <orderState>${status}</orderState>
    </UpdateOrderV2>
      </soap12:Body>
    </soap12:Envelope>`
  axios
    .post(
      'http://messaging.yemeksepeti.com/messagingwebservice/integration.asmx',
      xlms,
      {
        headers: { 'Content-Type': 'text/xml' },
      }
    )
    .then(async (res) => {
      let xmlString = res.data
      let p = convert.xml2json(xmlString, { compact: true, spaces: 4 })
      let item = JSON.parse(p)

      let body = item['soap:Envelope']
      body = body['soap:Body']['UpdateOrderV2Response']

      if (body) {
        body = body['UpdateOrderV2Result']

        cb(null, body)
      } else {
        cb(null, null)
      }
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        //console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        //console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }

      cb(true, null)
    })
}
async function getMenu(body, cb) {
  let xmls = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Header>
    <AuthHeader xmlns="http://tempuri.org/">
      <UserName>${body['username']}</UserName>
      <Password>${body['password']}</Password>
    </AuthHeader>
  </soap12:Header>
  <soap12:Body>
  <GetMenu xmlns="http://tempuri.org/" />
  </soap12:Body>
</soap12:Envelope>`
  axios
    .post(
      'http://messaging.yemeksepeti.com/messagingwebservice/integration.asmx',
      xmls,
      {
        headers: { 'Content-Type': 'text/xml' },
      }
    )
    .then(async (res) => {
      let xmlString = res.data
      let p = xmlParser.xml2json(xmlString)
      let item = JSON.parse(p)

      body['menu'] = {
        modifierGroups:
          item['soap:Envelope']['soap:Body']['GetMenuResponse'][
            'GetMenuResult'
          ]['diffgr:diffgram']['Menu']['Options'],
        products:
          item['soap:Envelope']['soap:Body']['GetMenuResponse'][
            'GetMenuResult'
          ]['diffgr:diffgram']['Menu']['Products'],
      }

      if (process.env.ORTAM == 'dev') {
        fs.writeFile(
          'attributes.json',
          JSON.stringify(body),
          function (err, data) {
            console.log(err, data)
          }
        )
      }

      cb(null, body)
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
      cb(true, null)
    })
}
async function onayliyorum(messageID, body, cb) {
  let xlms = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Header>
        <AuthHeader xmlns="http://tempuri.org/">
        <UserName>${body.integration['username']}</UserName>
        <Password>${body.integration['password']}</Password>
        </AuthHeader>
      </soap12:Header>
      <soap12:Body>
        <UpdateOrderV2 xmlns="http://tempuri.org/">
            <orderId>${messageID}</orderId>
                 <orderState>Approved</orderState>
            </UpdateOrderV2>
      </soap12:Body>
    </soap12:Envelope>`
  axios
    .post(
      'http://messaging.yemeksepeti.com/messagingwebservice/integration.asmx',
      xlms,
      {
        headers: { 'Content-Type': 'text/xml' },
      }
    )
    .then(async (res) => {
      let xmlString = res.data
      let p = convert.xml2json(xmlString, { compact: true, spaces: 4 })
      let item = JSON.parse(p)

      let body = item['soap:Envelope']
      body = body['soap:Body']['MessageSuccessfulV2Response']
      console.log(body)

      cb(null, body)
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
      cb(true, null)
    })
}
async function onayliyorum2(messageID, body, cb) {
  let xlms = `<?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Header>
          <AuthHeader xmlns="http://tempuri.org/">
          <UserName>${body.integration['username']}</UserName>
          <Password>${body.integration['password']}</Password>
          </AuthHeader>
        </soap12:Header>
        <soap12:Body>
          <UpdateOrderV2 xmlns="http://tempuri.org/">
              <orderId>${messageID}</orderId>
                   <orderState>Accepted</orderState>
              </UpdateOrderV2>
        </soap12:Body>
      </soap12:Envelope>`
  axios
    .post(
      'http://messaging.yemeksepeti.com/messagingwebservice/integration.asmx',
      xlms,
      {
        headers: { 'Content-Type': 'text/xml' },
      }
    )
    .then(async (res) => {
      let xmlString = res.data
      let p = convert.xml2json(xmlString, { compact: true, spaces: 4 })
      let item = JSON.parse(p)

      let body = item['soap:Envelope']
      body = body['soap:Body']['MessageSuccessfulV2Response']
      console.log(body)

      cb(null, body)
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
      cb(true, null)
    })
}
async function okudum(messageID, body, cb) {
  let xlms = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Header>
        <AuthHeader xmlns="http://tempuri.org/">
        <UserName>${body.integration['username']}</UserName>
        <Password>${body.integration['password']}</Password>
        </AuthHeader>
      </soap12:Header>
      <soap12:Body>
        <MessageSuccessfulV2 xmlns="http://tempuri.org/">
          <messageId>${messageID}</messageId>
        </MessageSuccessfulV2>
      </soap12:Body>
    </soap12:Envelope>`
  axios
    .post(
      'http://messaging.yemeksepeti.com/messagingwebservice/integration.asmx',
      xlms,
      {
        headers: { 'Content-Type': 'text/xml' },
      }
    )
    .then(async (res) => {
      let xmlString = res.data
      let p = convert.xml2json(xmlString, { compact: true, spaces: 4 })
      let item = JSON.parse(p)

      let body = item['soap:Envelope']
      body = body['soap:Body']['MessageSuccessfulV2Response']
      console.log(body)

      cb(null, body)
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
      cb(true, null)
    })
}

async function getOrder(body, count = 2, cb) {
  let xlms = `<?xml version="1.0" encoding="utf-8"?>
  <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Header>
      <AuthHeader xmlns="http://tempuri.org/">
        <UserName>${body.integration['username']}</UserName>
        <Password>${body.integration['password']}</Password>
      </AuthHeader>
    </soap12:Header>
    <soap12:Body>
      <GetAllMessagesV3 xmlns="http://tempuri.org/" />
    </soap12:Body>
  </soap12:Envelope>
  `

  axios
    .post(
      'http://messaging.yemeksepeti.com/messagingwebservice/integration.asmx',
      xlms,
      {
        headers: { 'Content-Type': 'text/xml' },
      }
    )
    .then(async (res) => {
      let xmlString = res.data
      let p = convert.xml2json(xmlString, { compact: true, spaces: 4 })
      let item = JSON.parse(p)

      let body = item['soap:Envelope']

      body = body['soap:Body']['GetAllMessagesV3Response']

      if (body) {
        body = body['GetAllMessagesV3Result']

        if (body) {
          let text = body['_text']
          p = convert.xml2json(text, { compact: true, spaces: 4 })
          body = JSON.parse(p)
          //if (process.env.ORTAM == 'dev') {
          if (_.has(body, 'messages')) {
            if (_.has(body['messages'], 'order')) {
              fs.writeFile(
                'attributes.json',
                JSON.stringify(body['messages']['order']),
                function (err, data) {
                  console.log(err, data)
                }
              )
            }
          }

          // }
          cb(null, body['messages']['order'])
        } else {
          cb(null, body)
        }
      } else {
        cb(null, null)
      }
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        //console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        //console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }

      cb(true, null)
    })
}
class YS {
  constructor(data, count = 2) {
    this.data = data
    this.count = count
  }
  async okudum(orderId, cb) {
    await okudum(orderId, this.data, cb)
  }
  async getOrder() {
    await getOrder(this.data, this.count, async (err, body) => {
      let env = await getEnvironment()
      let serverResult = {}
      //

      if (!err) {
        if (body) {
          serverResult = await _asyncrequest(
            '/api/ys/order',
            'POST',
            { data: body },
            {
              Authorization: 'Bearer ' + env.token,
              Accept: 'application/json',
            }
          ).catch((e) => {
            console.log(e.error.message, 'SERVERDANs')
          })
        }

        if (serverResult && body) {
          if (serverResult.success) {
            console.log(body, Array.isArray(body), 'settimeout')
            if (Array.isArray(body)) {
              if (body.length) {
                await asyncForEach(body, async (data) => {
                  let messageID = data['_attributes']['MessageId']
                  if (process.env.LOG == true) {
                    fs.writeFileSync(
                      './logs/yemeksepeti-' + messageID + '.json',
                      JSON.stringify(body)
                    )
                  }
                })
              }
            } else {
              let messageID = body['_attributes']['MessageId']
              if (process.env.LOG == true) {
                fs.writeFileSync(
                  './logs/yemeksepeti-' + messageID + '.json',
                  JSON.stringify(body)
                )
              }
            }
          } // fs.writeFileSync('./sonuc3.json', JSON.stringify(serverResult))
        }
      } else {
        console.log(err)
      }
    })
  }
  async set700(orderId, cb) {
    let status = 'OnDelivery'
    await changeStatus(orderId, this.data, status, cb)
  }
  async set900(orderId, cb) {
    let status = 'Delivered'
    await changeStatus(orderId, this.data, status, cb)
  }
  async set500(orderId, cb) {
    let status = 'Approved'
    if (this.data.otomatikOnay) {
      await onayliyorum(orderId, this.data, cb)
      await onayliyorum2(orderId, this.data, cb)
      await changeStatus(orderId, this.data, status, cb)
    }
  }
  async cancelOption() {
    try {
      let xlms = `<?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Header>
          <AuthHeader xmlns="http://tempuri.org/">
          <UserName>${integration['secretKey']}</UserName>
          <Password>${integration['apiKey']}</Password>
          </AuthHeader>
        </soap12:Header>
        <soap12:Body>
          <GetRejectReasons xmlns="http://tempuri.org/" />
        </soap12:Body>
      </soap12:Envelope>`
      axios
        .post(
          'http://messaging.yemeksepeti.com/messagingwebservice/integration.asmx',
          xlms,
          {
            headers: { 'Content-Type': 'text/xml' },
          }
        )
        .then(async (res) => {
          let xmlString = res.data
          let p = convert.xml2json(xmlString, { compact: true, spaces: 4 })
          let item = JSON.parse(p)
          cb(null, item)
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data)
            console.log(error.response.status)
            //console.log(error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            //console.log(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
          }
          cb(true, null)
        })
    } catch (error) {}
  }
  async cancel(orderId, rid, cb) {
    try {
      //Approved or Accepted or Rejected or Cancelled or OnDelivery or Delivered or TechnicalRejected
      let xlms = `<?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Header>
          <AuthHeader xmlns="http://tempuri.org/">
          <UserName>${this.data.integration['secretKey']}</UserName>
          <Password>${this.data.integration['apiKey']}</Password>
          </AuthHeader>
        </soap12:Header>
        <soap12:Body>
        <UpdateOrderV2 xmlns="http://tempuri.org/">
        <orderId>${orderId}</orderId>
        <orderState>Rejected</orderState>
        <rejectReasonId>${rid}</rejectReasonId>
      </UpdateOrderV2>
        </soap12:Body>
      </soap12:Envelope>`
      axios
        .post(
          'http://messaging.yemeksepeti.com/messagingwebservice/integration.asmx',
          xlms,
          {
            headers: { 'Content-Type': 'text/xml' },
          }
        )
        .then(async (res) => {
          let xmlString = res.data
          let p = convert.xml2json(xmlString, { compact: true, spaces: 4 })
          let item = JSON.parse(p)
          cb(null, item)
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data)
            console.log(error.response.status)
            //console.log(error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            //console.log(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
          }
          cb(true, null)
        })
    } catch (error) {
      console.log(error)
    }
  }
}
module.exports = YS
