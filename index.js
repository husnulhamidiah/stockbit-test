import {} from 'dotenv/config'
import http from 'http'
import express from 'express'
import logger from 'morgan'
import log from 'debug'
import { middleware } from 'jsend'
import routes from './routes'

const app = express()
const port = process.env.PORT

const debug = log('stockbit-test:server')

app.set('port', port)

// refs: https://stackoverflow.com/q/42009672
app.use(logger('dev', { stream: { write: msg => debug(msg.trim()) } }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(middleware)
app.use('/api', routes)

const server = http.createServer(app)

server.listen(port, () => debug(`listening on port ${port}`))
