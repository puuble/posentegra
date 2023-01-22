let crypt = require('../bin/lib/crypt')
let template = '{"storeIds": ["23000000101029"]}'
let passKey = crypt.AESEncrypt(template, 'aNdRgUkXp2s5u8x/A?D(G+KbPeShVmYq')
console.log(passKey)
