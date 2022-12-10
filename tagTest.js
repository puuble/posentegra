const Query = require('./bin/lib/query')

async function test() {
  let checkTag = `{
        getTickets(start: "2022-12-06 20:30", end: "2022-12-06 21:30", isClosed: false) {
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
