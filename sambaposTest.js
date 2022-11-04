const Sambapos = require('./bin/lib/sambapos')
const sambapos = new Sambapos()
const Query = require('./bin/lib/query')
async function main() {
  let s = await sambapos.authCheck()
  console.log(s)
  let query = new Query({})
  let menu = await query.getProducts()
  console.log(menu)
}
main()
