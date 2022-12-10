const Query = require('./bin/lib/query')

async function test() {
  let checkTag = `{
    getTickets(start: "2022-12-10 22:20", end: "2022-12-10 22:45", isClosed: false) {
      id
      tags {
        tagName
        tag
      }
    }
  }`
  const q = new Query()
  let tags = await q.getQueryWithText(checkTag)
  console.log(tags)
}

test()
