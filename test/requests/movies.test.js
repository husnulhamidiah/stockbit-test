import { expect } from 'chai'
import supertest from 'supertest'
import nock from 'nock'
import server from '../../index'
import { sequelize, Log } from '../../models'

const request = supertest(server)

describe('route /movies', () => {
  beforeEach(() => {
    return Log.sync({ force: true })
  })

  describe('with complete params', () => {
    it('should return array of movies', async () => {
      const response = {
        Search: [{}, {}, {}],
        totalResults: '366',
        Response: 'True'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(200, response)

      const result = await request
        .get('/api/movies/?apikey=28kzl&s=batman&page=1')

      expect(result.status).to.equal(200)
      expect(result.body.data).to.deep.equal(response)
    })

    it('should return movie not found', async () => {
      const response = {
        Response: 'False',
        Error: 'Movie not found!'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(200, response)

      const result = await request
        .get('/api/movies/?apikey=28kzl&s=xjnasj38209&page=1')

      expect(result.status).to.equal(200)
      expect(result.body.data).to.deep.equal(response)
    })
  })

  describe('with incomplete params', () => {
    it('should return something went wrong', async () => {
      const response = {
        Response: 'False',
        Error: 'Something went wrong.'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(200, response)

      const result = await request
        .get('/api/movies/?apikey=28kzl')

      expect(result.status).to.equal(200)
      expect(result.body.data).to.deep.equal(response)
    })

    it('should return no api key provided', async () => {
      const response = {
        Error: 'No API key provided.',
        Response: 'False'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(401, response)

      const result = await request
        .get('/api/movies/?s=batman&page=2')

      expect(result.status).to.equal(401)
      expect(result.body.data).to.deep.equal(response)
    })

    it('should return invalid api key', async () => {
      const response = {
        Error: 'Invalid API key!',
        Response: 'False'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(401, response)

      const result = await request
        .get('/api/movies/?apikey=29ms9&s=batman&page=2')

      expect(result.status).to.equal(401)
      expect(result.body.data).to.deep.equal(response)
    })
  })

  after(() => {
    return Log.sync({ force: true })
  })
})

describe('route /movies/:id', () => {
  beforeEach(() => {
    return Log.sync({ force: true })
  })

  describe('with complete params', () => {
    it('should return array of movies', async () => {
      const response = {
        Title: 'The Social Network',
        Year: '2010',
        Rated: 'PG-13',
        Response: 'True'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(200, response)

      const result = await request
        .get('/api/movies/tt1285016/?apikey=28kzl')

      expect(result.status).to.equal(200)
      expect(result.body.data).to.deep.equal(response)
    })

    it('should return movie not found', async () => {
      const response = {
        Response: 'False',
        Error: 'Movie not found!'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(200, response)

      const result = await request
        .get('/api/movies/tt1285016/?apikey=28kzl')

      expect(result.status).to.equal(200)
      expect(result.body.data).to.deep.equal(response)
    })
  })

  describe('with incomplete params', () => {
    it('should return no api key provided', async () => {
      const response = {
        Error: 'No API key provided.',
        Response: 'False'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(401, response)

      const result = await request
        .get('/api/movies/tt1285016/')

      expect(result.status).to.equal(401)
      expect(result.body.data).to.deep.equal(response)
    })

    it('should return invalid api key', async () => {
      const response = {
        Error: 'Invalid API key!',
        Response: 'False'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(401, response)

      const result = await request
        .get('/api/movies/tt1285016/?apikey=29ms9')

      expect(result.status).to.equal(401)
      expect(result.body.data).to.deep.equal(response)
    })
  })

  after(() => {
    return Log.sync({ force: true })
  })
})

after(() => {
  nock.restore()
  sequelize.close()
  server.close()
})
