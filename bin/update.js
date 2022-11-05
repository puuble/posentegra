const fs = require('fs')
const Sambapos = require('./lib/sambapos')
const sambapos = new Sambapos()
async function main() {
  let s = await sambapos.authCheck()
  if (fs.existsSync('setup.js')) {
    fs.unlink('setup.js')
  }
}
main()
