const fs = require('fs')
const Sambapos = require('./lib/sambapos')
let db = new DB()

async function main() {
  let env = await db.getField('enviroment')
  const sambapos = new Sambapos()
  let s = await sambapos.authCheck()
  console.log(s)
}
main()
