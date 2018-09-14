const environments = {}

environments.staging = {
  envName: 'staging',
  httpPort: 3000,
  httpsPort: 3001
}

environments.production = {
  envName: 'production',
  httpPort: 5000,
  httpsPort: 5001
}

const currentEnv = process.env.NODE_ENV || 'staging'
const envToExport = typeof (environments[currentEnv]) === 'object' ? environments[currentEnv] : environments.staging

module.exports = envToExport
