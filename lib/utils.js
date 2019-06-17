
import crypto from 'crypto'

export let to = function (promise) {
  return promise.then(function (val) {
    return val || {}
  }).catch(function (err) {
    err.isError = true
    return err
  })
}

export let uniqueId = function (length = 10) {
  let chars = '1234567890BCDFGHJKMNPQRSTVWXYZ'
  let bytes = Array.from(crypto.randomBytes(length))

  let value = bytes.map(function (byte, idx) {
    return chars[byte % chars.length].toString()
  })

  return value.join('')
}
