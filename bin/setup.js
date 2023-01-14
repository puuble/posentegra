const fs = require('fs')
const Sambapos = require('./lib/sambapos')
let db = new DB()

async function main() {
  let env = await db.getField('enviroment')
  const sambapos = new Sambapos()
  let s = await sambapos.authCheck()
  console.log(s)
  let json = `{
        "pos": {
            "host": "127.0.0.1",
            "port": "9000",
            "name": "test",
            "username": "Entegrasyon",
            "password": "73737373",
            "client_id": "Entegrasyon"
        }
    }`
  //fs.writeFileSync('./tmp/enviroment.json', json)
}
main()
