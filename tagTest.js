const Query = require('./bin/lib/query')
const _ = require('lodash')
const { asyncFilter, asyncForEach } = require('./bin/lib/helpers')

async function test(checkTag) {
  const q = new Query()
  let tags = await q.getQueryWithText(checkTag)
  let check = false
  if (tags) {
    if (_.has(tags, 'getTickets')) {
      tags = tags['getTickets']
      let result = null
      await asyncForEach(tags, async (v) => {
        if (Array.isArray(v['tags'])) {
          let filter = await asyncFilter(v['tags'], async (t) => {
            return (
              t['tagName'] == 'ID' && t['tag'] == '6394dc9557fdecdfff3331e5'
            )
          })
          if (Array.isArray(filter)) {
            if (filter.length > 0) {
              result = { id: '', filter: [] }
              result['id'] = v['id']
              result['filter'] = filter[0]
            }
          }
        }
      })

      if (_.has(result, 'id')) {
        check = result['id']
      }
    }
  }

  return check
}
async function main() {
  let checkTag = `{
        getTickets(start: "2022-12-10 22:20", end: "2022-12-10 22:45", isClosed: false) {
          id
          tags {
            tagName
            tag
          }
        }
      }`
  await test(checkTag)
}
main()
