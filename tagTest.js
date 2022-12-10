const Query = require('./bin/lib/query')
const _ = require('lodash')
const { asyncFilter } = require('./bin/lib/helpers')

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
  if (tags) {
    if (_.has(tags, 'getTickets')) {
      tags = tags['getTickets']
      let filtered = await asyncFilter(tags, async (v) => {
        let result = { id: v['id'], filter: [] }
        if (Array.isArray(v['tags'])) {
          let filter = await asyncFilter(v['tags'], async (t) => {
            return t['tagName'] == 'ID'
          })

          result['filter'] = filter
        }

        return result
      })

      console.log(filtered)
    }
  }
  console.log(tags)
}

test()
