require('dotenv').config()
const asyncrequest = require('request-promise')
const fs = require('fs')
const SERVER = process.env.SERVER

const asyncFilter = async (arr, predicate) => {
  const results = await Promise.all(arr.map(predicate))

  return arr.filter((_v, index) => results[index])
}
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function getEnvironment() {
  try {
    let data = null
    if (fs.existsSync('./tmp/enviroment.json')) {
      data = fs.readFileSync('./tmp/enviroment.json', 'utf8')
      data = JSON.parse(data)
    }
    return data
  } catch (err) {
    console.error(err)
  }
}
async function sendFormData(url, method = 'GET', data = {}, headers = {}) {
  let options = {
    method,
    formData: data,
    url,
    headers,
  }
  return asyncrequest(options)
}

async function _asyncrequest(
  url,
  method = 'POST',
  data = {},
  headers = {},
  host = SERVER
) {
  var options = {
    method,
    body: data,
    json: true,
    url: host + url,
    headers,
  }

  return asyncrequest(options)
}
async function _providerrequest(
  url,
  method = 'POST',
  data = {},
  headers = {},
  host = `https://api.trendyol.com`
) {
  if (host) {
    url = host + url
  }
  console.log(url)
  var options = {
    method,
    body: data,
    json: true,
    url,
    headers,
  }

  return asyncrequest(options)
}
module.exports = {
  asyncForEach,
  getEnvironment,
  sendFormData,
  _providerrequest,
  _asyncrequest,
  asyncFilter,
}
