const Sambapos = require('./bin/lib/sambapos')
const sambapos = new Sambapos()

async function main() {
  let s = await sambapos.authCheck()
  console.log(s)
}
main()
