let substruct = require('@internalfx/substruct')
let config = substruct.config

let nedb = substruct.services.nedb

module.exports = {
  webhook: async function (ctx) {
    await nedb.requests.insert({
      headers: ctx.request.headers,
      method: ctx.request.method,
      length: ctx.request.length,
      href: ctx.request.href,
      type: ctx.request.type,
      query: ctx.request.query,
      ip: ctx.request.ip,
      body: ctx.request.body
    })

    let removeList = await nedb.requests.findCursor({}).sort({ createdAt: -1 }).skip(10).exec()

    if (removeList.length > 0) {
      let ids = removeList.map(function (record) {
        return record._id
      })
      await nedb.requests.remove({ _id: { $in: ids } }, { multi: true })
    }

    ctx.body = {}
  }
}
