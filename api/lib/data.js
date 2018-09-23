const fs = require('fs')
const path = require('path')

const helpers = require('./helpers')

const lib = {}

lib.baseDir = path.join(__dirname, '..', '.data')

lib.create = function (dir, file, data, callback) {
  fs.open(
    path.join(lib.baseDir, dir, `${file}.json`),
    'wx',
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data)
        fs.writeFile(fileDescriptor, stringData, err => {
          if (!err) {
            fs.close(fileDescriptor, err => {
              if (!err) {
                callback(err)
              } else {
                const errMsg = 'Error closing the file.'
                callback(errMsg)
              }
            })
          } else {
            const errMsg = 'Error writing the file.'
            callback(errMsg)
          }
        })
      } else {
        const errMsg = 'Error opening the file.'
        callback(errMsg)
      }
    }
  )
}

lib.read = function (dir, file, callback) {
  fs.readFile(
    path.join(lib.baseDir, dir, `${file}.json`),
    'utf-8',
    (err, data) => {
      if (!err && data) {
        const parsedData = helpers.parseJsonToObject(data)
        callback(null, parsedData)
      } else {
        callback(err)
      }
    }
  )
}

lib.update = function (dir, file, data, callback) {
  fs.open(
    path.join(lib.baseDir, dir, `${file}.json`),
    'r+',
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data)
        fs.truncate(fileDescriptor, (err) => {
          if (!err) {
            fs.writeFile(fileDescriptor, stringData, err => {
              if (!err) {
                fs.close(fileDescriptor, err => {
                  if (!err) {
                    callback(err)
                  } else {
                    const errMsg = 'Error closing the file.'
                    callback(errMsg)
                  }
                })
              } else {
                const errMsg = 'Error writing the file.'
                callback(errMsg)
              }
            })
          } else {
            const errMsg = 'Error truncating the file.'
            callback(errMsg)
          }
        })
      } else {
        const errMsg = 'Error opening the file.'
        callback(errMsg)
      }
    }
  )
}

lib.delete = function (dir, file, callback) {
  fs.unlink(
    path.join(lib.baseDir, dir, `${file}.json`),
    (err) => {
      if (!err) {
        callback(err)
      } else {
        const errMsg = 'Error deleting the file.'
        callback(errMsg)
      }
    }
  )
}

module.exports = lib
