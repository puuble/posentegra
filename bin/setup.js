const fs = require('fs')
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
fs.writeFileSync('./tmp/enviroment.json', json)
