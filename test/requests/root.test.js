import { expect } from 'chai'
import supertest from 'supertest'
import nock from 'nock'
import server from '../../index'

const request = supertest(server)

describe('route /', () => {
  it('should return hello world', async () => {
    const response = { data: 'ok', status: 'success' }

    const result = await request
      .get('/api')

    expect(result.status).to.equal(200)
    expect(result.body).to.deep.equal(response)
  })
})

describe('route /404', () => {
  it('should return route not found', async () => {
    const response = { message: 'route not found', status: 'fail' }

    const result = await request
      .get('/api/404')

    expect(result.status).to.equal(404)
    expect(result.body).to.deep.equal(response)
  })
})

after(() => {
  nock.restore()
  server.close()
})
