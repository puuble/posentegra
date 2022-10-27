require('dotenv').config()
const _ = require('lodash')
const {
  sendFormData,
  _asyncrequest,
  _providerrequest,
  getEnvironment,
  asyncForEach,
} = require('./helpers')

class TY {
  constructor(data, status = 'Created') {
    this.data = data.integration
    this.status = status
    this.option = data
  }
  async findOrder(id) {
    let { apiKey, apiSecretKey, supplierId } = this.data
    var auth =
      'Basic ' + Buffer.from(apiKey + ':' + apiSecretKey).toString('base64')

    let result = await sendFormData(
      `https://api.trendyol.com/mealgw/suppliers/${supplierId}/packages/${id}`,
      'GET',
      {
        packageStatuses: this.status,
        size: 1,
      },
      {
        Authorization: auth,
        'x-agentname': 'PosEntegra',
        'x-executor-user': 'reseller@posentegra.com',
      }
    ).catch((err) => {
      console.log(err.message, 'hata')
    })
    return result
  }
  async getOrder(sendBackend = true) {
    let { apiKey, apiSecretKey, supplierId } = this.data
    var auth =
      'Basic ' + Buffer.from(apiKey + ':' + apiSecretKey).toString('base64')

    let result = await sendFormData(
      `https://api.trendyol.com/mealgw/suppliers/${supplierId}/packages`,
      'GET',
      {
        packageStatuses: this.status,
        size: this.data.size ?? 1,
        page: this.data.page ?? 0,
      },
      {
        Authorization: auth,
        'x-agentname': 'PosEntegra',
        'x-executor-user': 'reseller@posentegra.com',
      }
    ).catch((err) => {
      console.log(err.message, 'hata')
    })
    let totalResult = []
    let sonuc
    if (result) {
      sonuc = JSON.parse(result)

      if (sonuc.size > 0) {
        let env = await getEnvironment()
        let serverResult = null
        if (sendBackend) {
          serverResult = await _asyncrequest(
            '/api/ty/order',
            'POST',
            { data: sonuc.content },
            {
              Authorization: 'Bearer ' + env.token,
              Accept: 'application/json',
            }
          ).catch((e) => {
            console.log(e.error.message, 'SERVERDANs')
          })
          console.log(serverResult, 'result ty')
        }

        if (serverResult) {
          if (serverResult.success) {
            if (Array.isArray(sonuc.content)) {
              if (sonuc.content.length > 0) {
                await asyncForEach(sonuc.content, async (data) => {
                  this.env
                  let pid = data.id
                  if (this.option.otomatikOnay) {
                    await this.set500(pid)
                  }
                })
              }
            }
          }
        }
      }
    }
    return sonuc
  }
  async set700(packageId) {
    try {
      let { apiKey, apiSecretKey, supplierId } = this.data
      var auth =
        'Basic ' + Buffer.from(apiKey + ':' + apiSecretKey).toString('base64')
      let url = `/mealgw/suppliers/${supplierId}/packages/${packageId}/manual-shipped`
      let result = await _providerrequest(
        url,
        'PUT',
        {},
        {
          'x-agentname': 'PosEntegra',
          'x-executor-user': 'reseller@posentegra.com',
          Authorization: auth,
        }
      ).catch((e) => {
        console.log(e.error.message, 'SERVERDAN')
      })
      console.log(result)
      return true
    } catch (error) {
      return false
    }
  }
  async set600(packageId) {
    try {
      let { apiKey, apiSecretKey, supplierId } = this.data
      var auth =
        'Basic ' + Buffer.from(apiKey + ':' + apiSecretKey).toString('base64')
      let url = `/mealgw/suppliers/${supplierId}/packages/${packageId}/invoiced`
      let result = await _providerrequest(
        url,
        'PUT',
        {},
        {
          'x-agentname': 'PosEntegra',
          'x-executor-user': 'reseller@posentegra.com',
          Authorization: auth,
        }
      ).catch((e) => {
        console.log(e.error.message, 'SERVERDAN')
      })
      console.log(result)
      return true
    } catch (error) {
      return false
    }
  }
  async set900(packageId) {
    try {
      let { apiKey, apiSecretKey, supplierId } = this.data
      var auth =
        'Basic ' + Buffer.from(apiKey + ':' + apiSecretKey).toString('base64')
      let url = `/mealgw/suppliers/${supplierId}/packages/${packageId}/manual-delivered`
      let result = await _providerrequest(
        url,
        'PUT',
        {},
        {
          'x-agentname': 'PosEntegra',
          'x-executor-user': 'reseller@posentegra.com',
          Authorization: auth,
        }
      ).catch((e) => {
        console.log(e.error.message, 'SERVERDAN')
      })
      console.log(result)
      return true
    } catch (error) {
      return false
    }
  }
  async set550(packageId) {
    try {
      let { apiKey, apiSecretKey, supplierId } = this.data
      var auth =
        'Basic ' + Buffer.from(apiKey + ':' + apiSecretKey).toString('base64')
      let url = `/mealgw/suppliers/${supplierId}/packages/invoiced`
      await _providerrequest(
        url,
        'PUT',
        {
          packageId,
        },
        {
          'x-agentname': 'PosEntegra',
          'x-executor-user': 'reseller@posentegra.com',
          Authorization: auth,
        }
      ).catch((e) => {
        console.log(e.error.message, 'SERVERDAN')
      })
      return true
    } catch (error) {
      return false
    }
  }
  async set500(packageId) {
    try {
      let { apiKey, apiSecretKey, supplierId } = this.data
      var auth =
        'Basic ' + Buffer.from(apiKey + ':' + apiSecretKey).toString('base64')
      let url = `/mealgw/suppliers/${supplierId}/packages/picked`
      let result = await _providerrequest(
        url,
        'PUT',
        {
          packageId,
          preparationTime: 30,
        },
        {
          'x-agentname': 'PosEntegra',
          'x-executor-user': 'reseller@posentegra.com',
          Authorization: auth,
        }
      ).catch((e) => {
        console.log(e.error.message, 'SERVERDAN')
      })
      console.log(result)
      return true
    } catch (error) {
      return false
    }
  }
}
module.exports = TY
