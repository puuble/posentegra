const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('temp.db')
class DB {
  createSql = `CREATE TABLE IF NOT EXISTS "temp" (
	"id"	INTEGER NOT NULL,
	"access_token"	TEXT,
	"refresh_token"	TEXT,
	"expires"	TEXT,
	"enviroment"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);`
  createTokenSql = `CREATE TABLE IF NOT EXISTS "token" (
    "env"	TEXT
);`
  truncateSql = `DELETE FROM temp;
);`
  addLineSql = `INSERT INTO temp (id,access_token,refresh_token,expires,enviroment) VALUES (?,?,?,?,?)`

  createToken() {
    db.run(this.createTokenSql)
  }
  createTable() {
    db.run(this.createSql)
  }

  truncate() {
    db.run(this.truncateSql)
  }
  async addLine() {
    let check = await this.getField('enviroment')
    if (!check) {
      db.serialize(() => {
        const stmt = db.prepare(this.addLineSql)
        stmt.run(null, null, null, null, null)
        stmt.finalize()
      })
    }
  }

  query(sql, params) {
    return db.prepare(sql).all(params)
  }
  dbCheck() {
    console.log('Connected to the SQLite database.')
    db.serialize(() => {
      this.createTable()
      this.createToken()
      //this.truncate()
      this.addLine()
    })
  }
  access_token(token) {
    db.serialize(() => {
      const stmt = db.prepare('UPDATE temp SET access_token = ? WHERE ID = 1')
      stmt.run(`${token}`)
      stmt.finalize()
    })
  }
  refresh_token(token) {
    db.serialize(() => {
      const stmt = db.prepare('UPDATE temp SET refresh_token = ? WHERE ID = 1')
      stmt.run(`${token}`)
      stmt.finalize()
    })
  }
  expires(token) {
    db.serialize(() => {
      const stmt = db.prepare('UPDATE temp SET expires = ? WHERE ID = 1')
      stmt.run(`${token}`)
      stmt.finalize()
    })
  }
  enviroment(text) {
    db.serialize(() => {
      const stmt = db.prepare('UPDATE temp SET enviroment = ? WHERE ID = 1')
      stmt.run(`${text}`)
      stmt.finalize()
    })
  }
  dbToken(text) {
    db.serialize(() => {
      const stmt = db.prepare('INSERT INTO token (env) VALUES (?)')
      stmt.run(`${text}`)
      stmt.finalize()
    })
  }
  getField(field) {
    return new Promise((resolve, reject) => {
      let query = `SELECT ${field} FROM temp WHERE id = 1 ORDER BY id DESC LIMIT 1;`
      db.get(query, function (err, row) {
        if (err) {
          reject(err)
        } else {
          if (row) {
            field == 'enviroment'
              ? resolve(JSON.parse(row[field]))
              : resolve(row[field])
          } else {
            resolve(null)
          }
        }
      })
    })
  }
  getDBToken() {
    return new Promise((resolve, reject) => {
      db.get(`SELECT env FROM token LIMIT 1;`, function (err, row) {
        if (err) {
          reject(err)
        } else {
          if (row) {
            resolve(row['env'])
          } else {
            resolve(null)
          }
        }
      })
    })
  }
}
module.exports = DB
