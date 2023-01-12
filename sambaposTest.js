const DB = require('./bin/lib/database')

let env = `{"token":"6360169dba1bd2361c0bd0ff|MsU0csFqz2QeCEpQEFa3xSDLC3fhYmNqTXYgJuVg","userId":"6360169dba1bd2361c0bd0fe","pos":{"_id":"6373c589a74551dee21425f8","host":"127.0.0.1","port":"9000","name":"Posentegra aaa","username":"Entegrasyon","password":"73737373","client_id":"Entegrasyon","user":"6360169dba1bd2361c0bd0fe","bayi":"posentegra","updated_at":"2022-11-21T20:32:27.870000Z","created_at":"2022-10-29T12:10:49.726000Z"},"restaurants":{"6360298557dd43639c072a4d":{"ys":{"providerId":"60cdef4f451ac719569864f4","integration":{"username":"test","password":"test2","catalogName":"TR_AYDIN","categoryName":"d3efd5a3-4f9b-4cc1-87eb-5df543b65ef61"},"otomatikOnay":false,"slug":"ys","status":true,"restaurantId":"d3efd5a3-4f9b-4cc1-87eb-5df543b65ef61","yogun":false}}}}`
let db = new DB()

async function main() {
  let env = await db.getField('enviroment')
  console.log(env)
}
main()
