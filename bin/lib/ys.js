require('dotenv').config()
var convert = require('xml-js')
const axios = require('axios')
const fs = require('fs')
const _ = require('lodash')
const moment = require('moment')
const { asyncForEach, _asyncrequest, getEnvironment } = require('./helpers')
function waiting(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved')
    }, seconds)
  })
}

class YS {
  constructor(data, count = 2) {
    this.data = data
    this.count = count
  }
}
module.exports = YS
