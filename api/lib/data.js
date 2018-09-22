const fs = require('fs')
const path = require('path')

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
                /* eslint-disable */
                callback(false)
              } else {
                /* eslint-disable */
                callback('Não foi possível fechar o arquivo.')
              }
            })
          } else {
            /* eslint-disable */
            callback('Não foi possível escrever dados no novo arquivo.')
          }
        })
      } else {
        /* eslint-disable */
        callback('Não foi possível abrir esse arquivo e/ou ele já existe.')
      }
    }
  )
}

lib.read = function (dir, file, callback) {
  fs.readFile(
    path.join(lib.baseDir, dir, `${file}.json`),
    'utf-8',
    (err, data) => {
      callback(err, data)
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
                    callback(false)
                  } else {
                    callback('Erro ao fechar o arquivo: ', err)
                  }
                })
              } else {
                callback('Erro ao atualizar o arquivo', err)
              }
            })
          } else {
            callback('Erro ao fazer truncate: ', err)
          }
        })
      } else {
        callback('Esse arquivo não existe', err)
      }
    }
  )
}

lib.delete = function (dir, file, callback) {
  fs.unlink(
    path.join(lib.baseDir, dir, `${file}.json`),
    (err) => {
      if (!err) {
        callback(false)
      } else {
        callback('Erro ao remover o arquivo', err)
      }
    }
  )
}

module.exports = lib
