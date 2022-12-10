require('dotenv').config()

const _ = require('lodash')
const Sambapos = require('./sambapos')
const fs = require('fs')
const { asyncForEach, asyncFilter } = require('./helpers')
const sambapos = new Sambapos()

async function cleanTextWhileUndefined(fullText) {
  var regExp = /\[([^)]+)\]/
  var re = /\[[^\]]*\]/g
  var re2 = /\{[^\]]*\}/g
  var re3 = /undefined/g
  var re4 = /true|false/g
  var re5 = /null/g
  var matches = fullText.match(re)
  if (Array.isArray(matches)) {
    await asyncForEach(matches, (m) => {
      let getParent = regExp.exec(m)
      if (Array.isArray(getParent)) {
        var text = getParent[1] ? getParent[1].split(':') : false
        if (text) {
          let ntext = text[1] ? text[1] : text[0]
          if (Array.isArray(ntext.match(re2))) {
            fullText = fullText.replace(m, '')
          } else {
            ntext = ntext.replace(/\s/gi, '')
          }

          if (Array.isArray(ntext.match(re3))) {
            fullText = fullText.replace(m, '')
          }
          if (Array.isArray(ntext.match(re4))) {
            fullText = fullText.replace(m, '')
          }
          if (ntext == null) {
            fullText = fullText.replace(m, '')
          }
          if (ntext == 'null') {
            fullText = fullText.replace(m, '')
          }
          if (ntext == 'undefined') {
            fullText = fullText.replace(m, '')
          }
        }
      }
    })
    fullText = fullText.replace(/\n/gi, '')
    fullText = fullText.replace(/\[|\]/gi, '')
  }

  return fullText
}
async function changeNote(text) {
  var mySubString = text.substring(
    text.indexOf('note:'),
    text.lastIndexOf('states:') - 2
  )
  let ntext = await cleanTextWhileUndefined(mySubString)
  let newString = text.replace(mySubString, ntext)
  return newString
}
function removeSpecialChar(text) {
  text = text.replace(/\\\\,/g, '\\,')
  return text.replace(/[&\/\\#,+$~%*?<>]/g, '')
}

function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}
class Query {
  constructor(data) {
    this.data = data
    if (_.has(data, 'queries')) {
      this.queries = data.queries
      fs.writeFileSync(
        './logs/queries/sorgu-' + data.order.pid + '.json',
        JSON.stringify(data.queries)
      )
      this.order = data.order
    }
    this.accessToken
  }
  async count(key) {
    let result = 0
    let target = _.has(this.queries, key) ? this.queries[key] : false
    if (Array.isArray(target)) {
      result = target.length
    }
    return result
  }

  async queue(terminalId) {
    if (terminalId) {
      await this.addEntity()
      await this.updateEntityCustomData()
      let pos_ticket = await this.createTerminalTicket(terminalId)
      await this.updateTerminalTicket(terminalId)
      let addProduct = _.has(this.queries, 'addProduct')
      console.log('addProduct varmi', addProduct)
      if (addProduct) {
        await this.addProduct(terminalId)
      }
      await this.addOrderToTerminalTicket(terminalId, 0)

      //
      await this.addCalculationToTerminalTicket(terminalId)
      await this.changeEntityOfTerminalTicket(terminalId)
      await this.closeTerminalTicket(terminalId)
      let posTicketId = await this.getTerminalTickets(terminalId, pos_ticket)
      await this.unregisterTerminal(terminalId)
      await this.postTicketRefreshMessage()
      await this.postBroadcastMessage()
      return posTicketId
    }
  }
  async init() {
    this.accessToken = await sambapos.authCheck()

    let terminalId = await this.registerTerminal()
    let pos_ticket = await this.queue(terminalId)
    console.log('query bitti', pos_ticket)
    return pos_ticket
  }
  async getMessage(message, key = false) {
    let result = null
    if (message) {
      result = message['data']
      if (key) {
        result = result[key]
      }
    }
    if (key) {
      if (key != 'getProducts') {
      }
    } else {
    }

    return result
  }
  async arrayToGraphQl(ql) {
    ql = JSON.stringify(ql)
    ql = ql.replace(/"([^(")"]+)":/g, '$1:')
    return ql
  }
  async changeString(str, search, mapObj) {
    const replacer = new RegExp(search, 'g')
    str = str.replace(replacer, (matched) => mapObj[matched])

    return str
  }
  async getQueryWithText(q) {
    try {
      this.accessToken = await sambapos.authCheck()
      let query = {
        query: q,
        variables: null,
        operationName: '',
      }

      const message = await sambapos.query(query).catch((err) => {
        console.log('ERROR SAMBA Query', query)
        return null
      })
      return await this.getMessage(message)
    } catch (error) {
      console.log(error, 'getQuery')
    }
  }
  async getQuery() {
    try {
      this.accessToken = await sambapos.authCheck()
      this.data = {
        query: this.data,
        variables: null,
        operationName: '',
      }

      const message = await sambapos.query(this.data).catch((err) => {
        console.log('ERROR SAMBA Query', this.data)
        return null
      })
      return await this.getMessage(message)
    } catch (error) {
      console.log(error, 'getQuery')
    }
  }
  async batchQuery() {
    const asyncRes = await Promise.all(
      Object.keys(this.queries).map(async (m) => {
        let query = this.queries[m]
        return { document: query }
      })
    )
    await batch(asyncRes)
    return asyncRes
  }
  async registerTerminal() {
    try {
      let q = this.queries.registerTerminal

      q = {
        query: q,
        variables: null,
        operationName: 'm',
      }
      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message, 'registerTerminal')
    } catch (error) {
      console.log(error, 'registerTerminal')
    }
  }
  async addEntity() {
    try {
      let q = this.queries.addEntity

      q = {
        query: q,
        variables: null,
        operationName: 'm',
      }
      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message, 'addEntity')
    } catch (error) {
      console.log(error, 'addentity')
    }
  }
  async createTerminalTicket(terminalId) {
    let maps = {
      '{terminalId}': terminalId,
    }
    try {
      let q = await this.changeString(
        this.queries.createTerminalTicket,
        '{terminalId}',
        maps
      )

      q = {
        query: q,
        variables: null,
        operationName: 'm',
      }

      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message, 'createTerminalTicket')
    } catch (error) {
      console.log(error, 'createTerminalTicket')
    }
  }
  async updateTerminalTicket(terminalId) {
    try {
      let maps = {
        '{terminalId}': terminalId,
      }

      let queryString = await this.arrayToGraphQl(
        this.queries.updateTerminalTicket
      )
      queryString = removeSpecialChar(queryString)
      queryString = queryString.replace(/(^"|"$)/g, '')
      let q = await this.changeString(queryString, '{terminalId}', maps)

      q = {
        query: await changeNote(q),
        variables: null,
        operationName: 'm',
      }

      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message, 'updateTerminalTicket')
    } catch (error) {
      console.log(error, 'updateTerminalTicket')
    }
  }
  async updateEntityCustomData() {
    try {
      let d = this.queries.updateEntityCustomData

      if (Array.isArray(d)) {
        if (d.length > 0) {
          await asyncForEach(d, async (c) => {
            c = await cleanTextWhileUndefined(c)

            c = {
              query: c,
              variables: null,
              operationName: 'm',
            }
            await sambapos.query(c).catch((err) => {
              console.log('ERROR SAMBA Query', c)
              return null
            })
          })
        }
      }
      return true
    } catch (error) {
      console.log(error, 'updateEntityCustomData')
    }
  }
  async addProductWithText(d) {
    let c = removeSpecialChar(d)
    c = {
      query: c,
      variables: null,
      operationName: 'm',
    }
    let product = await sambapos.query(c).catch(async (err) => {
      console.log('urun eklemedi', c)
    })
    if (product) {
      console.log(product)
    }
  }
  async addProduct(terminalId) {
    try {
      let d = this.queries.addProduct

      if (Array.isArray(d)) {
        if (d.length > 0) {
          await asyncForEach(d, async (c, i) => {
            c = removeSpecialChar(c)

            c = {
              query: c,
              variables: null,
              operationName: 'm',
            }
            let product = await sambapos.query(c).catch(async (err) => {
              await this.postResetProductCacheMessage()

              let findProduct = this.queries.getProduct[i]
              console.log(findProduct, 'FIND PRODUCT')
              let productName = findProduct['name']
              productName = removeSpecialChar(productName)
              let getProducts = await this.getProducts()
              productName = convertToSlug(productName)

              let result = await asyncFilter(getProducts, async (item) => {
                let itemName = convertToSlug(item['name'])
                return itemName == productName
              })

              if (result) {
                if (Array.isArray(result)) {
                  if (result.length > 0) {
                    await this.addOrderToTerminalTicketWithProduct(
                      terminalId,
                      result[0]['id'],
                      i
                    )
                  }
                }
              }
            })

            product = await this.getMessage(product, 'addProduct')

            if (_.has(product, 'id')) {
              if (product.id) {
                await this.postResetProductCacheMessage()
                await this.addOrderToTerminalTicketWithProduct(
                  terminalId,
                  product.id,
                  i
                )
              }
            }
          })
        }
      }
      return d.length
    } catch (error) {
      console.log(error, 'addProduct')
    }
  }
  async addOrderToTerminalTicketWithProduct(
    terminalId,
    productId,
    key = false
  ) {
    try {
      let d = this.queries.addOrderToTerminalTicketWithProduct
      let maps = {
        '{terminalId}': terminalId,
        '{productId}': productId,
      }
      if (Array.isArray(d)) {
        if (d.length > 0) {
          if (key !== false) {
            let c = d[key]
            let q = await this.changeString(c, '{terminalId}|{productId}', maps)

            q = {
              query: q,
              variables: null,
              operationName: 'm',
            }
            await sambapos.query(q).catch((err) => {
              console.log('ERROR SAMBA Query', q.query)
              return null
            })
          } else {
            await asyncForEach(d, async (c, index) => {
              let q = await this.changeString(
                c,
                '{terminalId}|{productId}',
                maps
              )

              q = {
                query: q,
                variables: null,
                operationName: 'm',
              }
              await sambapos.query(q).catch((err) => {
                console.log('ERROR SAMBA Query', q.query)
                return null
              })
            })
          }
        }
      }
    } catch (error) {
      console.log(error, 'addOrderToTerminalTicketWithProduct')
    }
  }
  async addOrderToTerminalTicket(terminalId, productId, key = false) {
    try {
      let maps = {
        '{terminalId}': terminalId,
        '{productId}': productId,
      }
      let d = this.queries.addOrderToTerminalTicket
      console.log(d, 'addTerminal')
      if (Array.isArray(d)) {
        if (d.length > 0) {
          if (key !== false) {
            let c = d[key]
            let q = await this.changeString(c, '{terminalId}|{productId}', maps)

            q = {
              query: q,
              variables: null,
              operationName: 'm',
            }
            await sambapos.query(q).catch((err) => {
              console.log('ERROR SAMBA Query', q.query)
              return null
            })
          } else {
            await asyncForEach(d, async (c, index) => {
              let q = await this.changeString(
                c,
                '{terminalId}|{productId}',
                maps
              )

              q = {
                query: q,
                variables: null,
                operationName: 'm',
              }
              await sambapos.query(q).catch((err) => {
                console.log('ERROR SAMBA Query', q.query)
                return null
              })
            })
          }
        }
      } else {
        console.log('pure')
      }
      return true
    } catch (error) {
      console.log(error, 'addOrderToTerminalTicket')
    }
  }
  async addCalculationToTerminalTicket(terminalId) {
    let maps = {
      '{terminalId}': terminalId,
    }
    try {
      let q = await this.changeString(
        this.queries.addCalculationToTerminalTicket,
        '{terminalId}',
        maps
      )

      q = {
        query: q,
        variables: null,
        operationName: 'm',
      }
      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message, 'addCalculationToTerminalTicket')
    } catch (error) {
      console.log(error, 'addCalculationToTerminalTicket')
    }
  }
  async changeEntityOfTerminalTicket(terminalId) {
    let maps = {
      '{terminalId}': terminalId,
    }
    try {
      let q = await this.changeString(
        this.queries.changeEntityOfTerminalTicket,
        '{terminalId}',
        maps
      )

      q = {
        query: q,
        variables: null,
        operationName: 'm',
      }
      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message, 'changeEntityOfTerminalTicket')
    } catch (error) {
      console.log(error, 'changeEntityOfTerminalTicket')
    }
  }
  async closeTerminalTicket(terminalId) {
    let maps = {
      '{terminalId}': terminalId,
    }
    try {
      let q = await this.changeString(
        this.queries.closeTerminalTicket,
        '{terminalId}',
        maps
      )

      q = {
        query: q,
        variables: null,
        operationName: 'm',
      }
      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message, 'closeTerminalTicket')
    } catch (error) {
      console.log(error, 'closeTerminalTicket')
    }
  }
  async unregisterTerminal(terminalId) {
    let maps = {
      '{terminalId}': terminalId,
    }
    try {
      let q = await this.changeString(
        this.queries.unregisterTerminal,
        '{terminalId}',
        maps
      )

      q = {
        query: q,
        variables: null,
        operationName: 'm',
      }
      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message, 'unregisterTerminal')
    } catch (error) {
      console.log(error, 'unregisterTerminal')
    }
  }
  async getProduct(name) {
    let maps = {
      '{name}': name,
    }
    try {
      let textQuery = `query q1 {
        getProduct(name: "{name}") {
          id
        }
      }`
      let q = await this.changeString(textQuery, '{name}', maps)

      q = {
        query: q,
        variables: null,
        operationName: '',
      }
      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message)
    } catch (error) {
      console.log(error, 'unregisterTerminal')
    }
  }
  async getProducts() {
    this.accessToken = await sambapos.authCheck()
    console.log(this.accessToken, 'getProducts')
    try {
      let q = `{
        getProducts {
          id
          name
          portions {
            name
          }
        }
      }`

      q = {
        query: q,
        variables: null,
        operationName: '',
      }
      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message, 'getProducts')
    } catch (error) {
      console.log(error, 'getProducts')
    }
  }
  async postTicketRefreshMessage() {
    try {
      let q = this.queries.postTicketRefreshMessage

      q = {
        query: q,
        variables: null,
        operationName: 'm',
      }
      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message, 'postTicketRefreshMessage')
    } catch (error) {
      console.log(error, 'postTicketRefreshMessage')
    }
  }
  async postBroadcastMessage() {
    try {
      let q = this.queries.postBroadcastMessage

      q = {
        query: q,
        variables: null,
        operationName: 'm',
      }
      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message, 'postBroadcastMessage')
    } catch (error) {
      console.log(error, 'postBroadcastMessage')
    }
  }
  async getTerminalTickets(terminalId, pos_ticket) {
    try {
      let q = `query m {getTerminalTickets (terminalId:"${terminalId}"){id,uid}}`

      q = {
        query: q,
        variables: null,
        operationName: 'm',
      }
      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      let ticketIds = await this.getMessage(message, 'getTerminalTickets')

      if (Array.isArray(ticketIds)) {
        const asyncRes = await asyncFilter(ticketIds, async (i) => {
          return i.uid == pos_ticket['uid']
        })

        if (Array.isArray(asyncRes)) {
          if (asyncRes.length > 0) {
            pos_ticket = asyncRes[0]['id']
          } else {
            pos_ticket = 0
          }
        }
      }

      return pos_ticket
    } catch (error) {
      console.log(error)
    }
  }
  async entegrasyonIptal(pos_ticket) {
    try {
      let q = `mutation m {
        postBroadcastMessage(message: "EntegrasyonIptal-${pos_ticket}") {
          message
        }
      }`

      q = {
        query: q,
        variables: null,
        operationName: 'm',
      }
      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message, 'postBroadcastMessage')
    } catch (error) {
      console.log(error, 'postBroadcastMessage')
    }
  }
  async postResetProductCacheMessage() {
    try {
      let q = `mutation m {postResetProductCacheMessage {
        id
      }}`

      q = {
        query: q,
        variables: null,
        operationName: 'm',
      }
      let message = await sambapos.query(q).catch((err) => {
        console.log('ERROR SAMBA Query', q)
        return null
      })
      return await this.getMessage(message, 'postResetProductCacheMessage')
    } catch (error) {
      console.log(error, 'postResetProductCacheMessage')
    }
  }
  async ticketExists() {
    let checkTag = `{
        getTickets(orderBy:idDesc,take:100, isClosed: false) {
          id
          tags {
            tagName
            tag
          }
        }
      }`
    const q = new Query()
    let tags = await q.getQueryWithText(checkTag)
    let check = false
    if (tags) {
      if (_.has(tags, 'getTickets')) {
        tags = tags['getTickets']
        let result = null
        await asyncForEach(tags, async (v) => {
          if (Array.isArray(v['tags'])) {
            let filter = await asyncFilter(v['tags'], async (t) => {
              return (
                t['tagName'] == 'ID' && t['tag'] == '6394dc9557fdecdfff3331e5'
              )
            })
            if (Array.isArray(filter)) {
              if (filter.length > 0) {
                result = { id: '', filter: [] }
                result['id'] = v['id']
                result['filter'] = filter[0]
              }
            }
          }
        })

        if (_.has(result, 'id')) {
          check = result['id']
        }
      }
    }

    return check
  }
}

module.exports = Query
