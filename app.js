require('@babel/register')({
  cwd: __dirname,
  plugins: ['@babel/plugin-transform-modules-commonjs'],
  only: [
    './lib/*'
  ]
})

let argv = require('minimist')(process.argv.slice(2))
let pjson = require('./package.json')
let substruct = require('@internalfx/substruct')
let path = require('path')
let { ApolloServer, AuthenticationError } = require('apollo-server-koa')
let { typeDefs, resolvers } = require('./graphql/index.js')
require('./lib/cycle.js')

let configFile = null
let HELPTEXT = `
    Webhook Testing Server v${pjson.version}

    OPTIONS
    ===================================================================
    --config      Specify path to config file, if not specified WTS
                  will look for config.js in current working directory.
`

let main = async function () {
  process.env.NODE_ENV = argv.dev ? 'development' : 'production'

  if (argv.help) {
    console.log(HELPTEXT)
    return
  }

  let configPath = argv.config ? argv.config : './config.js'

  configPath = path.join(process.cwd(), configPath)

  try {
    configFile = require(configPath)
  } catch (err) {
    console.log('CONFIG FILE NOT FOUND! ======================')
    throw err
  }

  substruct.configure({
    port: configFile.port,
    runDir: process.cwd(),
    appDir: __dirname,
    local: configFile
  })

  let apollo = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: function (error) {
      let data = JSON.decycle(error)
      console.log('================================================================== GRAPHQL ERROR')
      console.dir(data, { colors: true, depth: null })
      console.log('================================================================================')
      return data
    },
    context: async function ({ ctx }) {
      let session = ctx.state.session
      let nedb = substruct.services.nedb
      let freeswitch = substruct.services.freeswitch

      if (session.loggedIn !== true) {
        throw new AuthenticationError('You are not logged in')
      }

      return {
        session,
        nedb,
        freeswitch
      }
    }
  })

  substruct.start().then(async function ({ koa, config }) {
    apollo.applyMiddleware({ app: substruct.koa, path: '/api/graphql' })
    console.log('Server Started...')
  }).catch(function (err) {
    console.error(err.stack)
  })
}

main().catch(function (err) {
  console.log(err)
})
