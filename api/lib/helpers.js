const crypto = require('crypto')

const config = require('./../config')

const helpers = {}

helpers.hash = function (str) {
  if (typeof (str) === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret)
      .update(str)
      .digest('hex')
    return hash
  } else {
    return false
  }
}

helpers.parseJsonToObject = function (buffer) {
  try {
    const obj = JSON.parse(buffer)
    return obj
  } catch (error) {
    return {}
  }
}

module.exports = helpers
