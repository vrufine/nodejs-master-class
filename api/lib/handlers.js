const _data = require('./data')

const helpers = require('./helpers')

const handlers = {}

handlers.notFound = (data, callback) => {
  const statusCode = 404
  callback(statusCode)
}

handlers.ping = (data, callback) => {
  const statusCode = 200
  callback(statusCode)
}

handlers.users = (data, callback) => {
  const accetableMethods = ['post', 'get', 'put', 'delete']
  if (accetableMethods.includes(data.method)) {
    handlers._users[data.method](data, callback)
  } else {
    const methodNotAllowedHttpCode = 405
    callback(methodNotAllowedHttpCode)
  }
}

handlers._users = {
  post: (data, callback) => {
    const firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
    const lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
    const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.trim().length > 10 ? data.payload.phone.trim() : false
    const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
    const tosAgreement = typeof (data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement ? data.payload.tosAgreement : false

    if (
      firstName &&
      lastName &&
      phone &&
      password &&
      tosAgreement
    ) {
      _data.read('users', phone, (err, data) => {
        if (err) {
          const hashedPassword = helpers.hash(password)
          if (hashedPassword) {
            const userObject = {
              firstName,
              lastName,
              phone,
              hashedPassword,
              tosAgreement
            }
            _data.create('users', phone, userObject, (err) => {
              if (!err) {
                const httpCode = 200
                callback(httpCode)
              } else {
                console.log(err)
                const httpCode = 500
                const errMsg = 'Could not create a new user'
                callback(httpCode, { Error: errMsg })
              }
            })
          } else {
            const errMsg = 'Could not hash the password'
            const httpCode = 500
            callback(httpCode, { Error: errMsg })
          }
        } else {
          const errMsg = 'An user with this phone number already exists.'
          const httpCode = 400
          callback(httpCode, { Error: errMsg })
        }
      })
    } else {
      const httpCode = 400
      callback(httpCode, { Error: 'Missing required fields' })
    }
  },
  get: (data, callback) => {
    const phone = typeof (data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length > 10
      ? data.queryStringObject.phone
      : false
    if (phone) {
      _data.read('users', phone, (err, readData) => {
        if (!err) {
          delete readData.hashedPassword
          const code = 200
          callback(code, readData)
        } else {
          const code = 404
          callback(code)
        }
      })
    } else {
      const code = 400
      callback(code, { Error: 'Missing required field' })
    }
  },
  put: (data, callback) => {
    //
    const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.trim().length > 10
      ? data.payload.phone
      : false

    const firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
    const lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
    const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false

    if (phone) {
      if (firstName || lastName || password) {
        _data.read('users', phone, (err, userData) => {
          if (!err && userData) {
            if (firstName) {
              userData.firstName = firstName
            }
            if (lastName) {
              userData.lastName = lastName
            }
            if (password) {
              userData.hashedPassword = helpers.hash(password)
            }
            _data.update('users', phone, userData, (err) => {
              if (!err) {
                const code = 200
                callback(code)
              } else {
                console.log(err)
                const code = 500
                callback(code, { Error: 'Could not update the user' })
              }
            })
          } else {
            const code = 404
            callback(code, { Error: 'User to update not found' })
          }
        })
      } else {
        const code = 400
        callback(code, { Error: 'Missing fields to update' })
      }
    } else {
      const code = 400
      callback(code, { Error: 'Missing required field' })
    }
  },
  delete: (data, callback) => {
    const phone = typeof (data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length > 10
      ? data.queryStringObject.phone
      : false
    if (phone) {
      _data.read('users', phone, (err, readData) => {
        if (!err) {
          _data.delete('users', phone, (err) => {
            if (!err) {
              const code = 200
              callback(code)
            } else {
              console.log(err)
              const code = 500
              callback(code, { Error: 'Could not delete the specified user' })
            }
          })
        } else {
          const code = 404
          callback(code, { Error: 'Could not find the specified user' })
        }
      })
    } else {
      const code = 400
      callback(code, { Error: 'Missing required field' })
    }
  }
}

module.exports = handlers
