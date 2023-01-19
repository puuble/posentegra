const crypto = require('crypto')

class SecurityHelper {
  static AESEncrypt(toEncrypt, key) {
    if (!toEncrypt) return ''

    const keyArray = Buffer.from(key, 'utf8')
    const toEncryptArray = Buffer.from(toEncrypt, 'utf8')

    const cipher = crypto.createCipheriv('aes-256-ecb', keyArray, null)
    let encrypted = cipher.update(toEncryptArray)
    encrypted = Buffer.concat([encrypted, cipher.final()])

    return encrypted.toString('base64')
  }
}
module.exports = SecurityHelper
