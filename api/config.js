const environments = {}

environments.staging = {
  envName: 'staging',
  port: 3000
}

environments.production = {
  envName: 'production',
  port: 5000
}

const currentEnv = process.env.NODE_ENV || 'staging'
const envToExport = typeof (environments[currentEnv]) === 'object' ? environments[currentEnv] : environments.staging

module.exports = envToExport
