/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'
import qs from 'querystring'
import nock from 'nock'
import movies from '../../controllers/movies'
import { sequelize, Log } from '../../models'

describe('movies controller', () => {
  describe('list', () => {
    beforeEach(() => {
      return Log.sync({ force: true })
    })

    it('should return array of movies', async () => {
      const req = {
        query: qs.parse('apikey=28kzl&s=batman&page=1')
      }

      const res = {
        json: sinon.spy(),
        status: sinon.stub()
          .returns({
            end: sinon.spy(),
            json: sinon.spy()
          })
      }

      const response = {
        Search: [],
        totalResults: '366',
        Response: 'True'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(200, response)

      await movies.list(req, res)

      const log = await Log.findOne({ raw: true })

      expect(log.id).to.equal(1)
      expect(log.reqTime).to.not.be.null
      expect(log.keyword).to.equal(req.query.s)
      expect(JSON.parse(log.result).data).to.deep.equal(response)

      expect(res.status.withArgs(200).calledOnce).to.be.true
      expect(res.status().json.withArgs({
        data: response,
        status: 'success'
      }).calledOnce).to.be.true
    })

    it('should return movie not found', async () => {
      const req = {
        query: qs.parse('apikey=28kzl&s=xjnasj38209&page=1')
      }

      const res = {
        json: sinon.spy(),
        status: sinon.stub()
          .returns({
            end: sinon.spy(),
            json: sinon.spy()
          })
      }

      const response = {
        Response: 'False',
        Error: 'Movie not found!'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(200, response)

      await movies.list(req, res)

      const log = await Log.findOne({ raw: true })

      expect(log.id).to.equal(1)
      expect(log.reqTime).to.not.be.null
      expect(log.keyword).to.equal(req.query.s)
      expect(JSON.parse(log.result).data).to.deep.equal(response)

      expect(res.status.withArgs(200).calledOnce).to.be.true
      expect(res.status().json.withArgs({
        data: response,
        status: 'success'
      }).calledOnce).to.be.true
    })

    it('should return something went wrong', async () => {
      const req = {
        query: qs.parse('apikey=28kzl')
      }

      const res = {
        json: sinon.spy(),
        status: sinon.stub()
          .returns({
            end: sinon.spy(),
            json: sinon.spy()
          })
      }

      const response = {
        Response: 'False',
        Error: 'Something went wrong.'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(200, response)

      await movies.list(req, res)

      const log = await Log.findOne({ raw: true })

      expect(log.id).to.equal(1)
      expect(log.reqTime).to.not.be.null
      expect(log.keyword).to.equal(null)
      expect(JSON.parse(log.result).data).to.deep.equal(response)

      expect(res.status.withArgs(200).calledOnce).to.be.true
      expect(res.status().json.withArgs({
        data: response,
        status: 'success'
      }).calledOnce).to.be.true
    })

    it('should return no api key provided', async () => {
      const req = {
        query: qs.parse('s=batman&page=2')
      }

      const res = {
        json: sinon.spy(),
        status: sinon.stub()
          .returns({
            end: sinon.spy(),
            json: sinon.spy()
          })
      }

      const response = {
        Error: 'No API key provided.',
        Response: 'False'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(401, response)

      await movies.list(req, res)

      const log = await Log.findOne({ raw: true })

      expect(log.id).to.equal(1)
      expect(log.reqTime).to.not.be.null
      expect(log.keyword).to.equal(req.query.s)
      expect(JSON.parse(log.result).data).to.deep.equal(response)

      expect(res.status.withArgs(401).calledOnce).to.be.true
      expect(res.status().json.withArgs({
        data: response,
        status: 'fail'
      }).calledOnce).to.be.true
    })

    it('should return invalid api key', async () => {
      const req = {
        query: qs.parse('apikey=29ms9&s=batman&page=2')
      }

      const res = {
        json: sinon.spy(),
        status: sinon.stub()
          .returns({
            end: sinon.spy(),
            json: sinon.spy()
          })
      }

      const response = {
        Error: 'Invalid API key!',
        Response: 'False'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(401, response)

      await movies.list(req, res)

      const log = await Log.findOne({ raw: true })

      expect(log.id).to.equal(1)
      expect(log.reqTime).to.not.be.null
      expect(log.keyword).to.equal(req.query.s)
      expect(JSON.parse(log.result).data).to.deep.equal(response)

      expect(res.status.withArgs(401).calledOnce).to.be.true
      expect(res.status().json.withArgs({
        data: response,
        status: 'fail'
      }).calledOnce).to.be.true
    })

    it('should return an error (request error)', async () => {
      const req = {
        query: qs.parse('apikey=29ms9&s=batman&page=2')
      }

      const res = {
        json: sinon.spy(),
        status: sinon.stub()
          .returns({
            end: sinon.spy(),
            json: sinon.spy()
          })
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .replyWithError({
          message: 'something went wrong',
          code: 'UNPREDICTED_ERROR'
        })

      await movies.list(req, res)

      const log = await Log.findOne({ raw: true })

      expect(log.id).to.equal(1)
      expect(log.reqTime).to.not.be.null
      expect(log.keyword).to.equal(req.query.s)
      expect(JSON.parse(log.result).data).to.be.null

      expect(res.status.withArgs(500).calledOnce).to.be.true
      expect(res.status().json.withArgs({
        status: 'fail'
      }).calledOnce).to.be.true
    })

    after(() => {
      return Log.sync({ force: true })
    })
  })

  describe('show', () => {
    beforeEach(() => {
      return Log.sync({ force: true })
    })

    it('should return detail of a movie', async () => {
      const req = {
        params: { id: 'tt1285016' },
        query: qs.parse('apikey=faf7e5bb')
      }

      const res = {
        json: sinon.spy(),
        status: sinon.stub()
          .returns({
            end: sinon.spy(),
            json: sinon.spy()
          })
      }

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

      await movies.show(req, res)

      const log = await Log.findOne({ raw: true })

      expect(log.id).to.equal(1)
      expect(log.reqTime).to.not.be.null
      expect(log.keyword).to.equal(req.params.id)
      expect(JSON.parse(log.result).data).to.deep.equal(response)

      expect(res.status.withArgs(200).calledOnce).to.be.true
      expect(res.status().json.withArgs({
        data: response,
        status: 'success'
      }).calledOnce).to.be.true
    })

    it('should return movie not found', async () => {
      const req = {
        params: { id: 'tt1285016x' },
        query: qs.parse('apikey=faf7e5bb')
      }

      const res = {
        json: sinon.spy(),
        status: sinon.stub()
          .returns({
            end: sinon.spy(),
            json: sinon.spy()
          })
      }

      const response = {
        Response: 'False',
        Error: 'Incorrect IMDb ID.'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(200, response)

      await movies.show(req, res)

      const log = await Log.findOne({ raw: true })

      expect(log.id).to.equal(1)
      expect(log.reqTime).to.not.be.null
      expect(log.keyword).to.equal(req.params.id)
      expect(JSON.parse(log.result).data).to.deep.equal(response)

      expect(res.status.withArgs(200).calledOnce).to.be.true
      expect(res.status().json.withArgs({
        data: response,
        status: 'success'
      }).calledOnce).to.be.true
    })

    it('should return something went wrong', async () => {
      const req = {
        params: { id: null },
        query: qs.parse('apikey=28kzl')
      }

      const res = {
        json: sinon.spy(),
        status: sinon.stub()
          .returns({
            end: sinon.spy(),
            json: sinon.spy()
          })
      }

      const response = {
        Response: 'False',
        Error: 'Something went wrong.'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(200, response)

      await movies.show(req, res)

      const log = await Log.findOne({ raw: true })

      expect(log.id).to.equal(1)
      expect(log.reqTime).to.not.be.null
      expect(log.keyword).to.equal(null)
      expect(JSON.parse(log.result).data).to.deep.equal(response)

      expect(res.status.withArgs(200).calledOnce).to.be.true
      expect(res.status().json.withArgs({
        data: response,
        status: 'success'
      }).calledOnce).to.be.true
    })

    it('should return no api key provided', async () => {
      const req = {
        params: { id: 'tt1285016' },
        query: {}
      }

      const res = {
        json: sinon.spy(),
        status: sinon.stub()
          .returns({
            end: sinon.spy(),
            json: sinon.spy()
          })
      }

      const response = {
        Error: 'No API key provided.',
        Response: 'False'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(401, response)

      await movies.show(req, res)

      const log = await Log.findOne({ raw: true })

      expect(log.id).to.equal(1)
      expect(log.reqTime).to.not.be.null
      expect(log.keyword).to.equal(req.params.id)
      expect(JSON.parse(log.result).data).to.deep.equal(response)

      expect(res.status.withArgs(401).calledOnce).to.be.true
      expect(res.status().json.withArgs({
        data: response,
        status: 'fail'
      }).calledOnce).to.be.true
    })

    it('should return invalid api key', async () => {
      const req = {
        params: { id: 'tt1285016' },
        query: qs.parse('apikey=29ms9')
      }

      const res = {
        json: sinon.spy(),
        status: sinon.stub()
          .returns({
            end: sinon.spy(),
            json: sinon.spy()
          })
      }

      const response = {
        Error: 'Invalid API key!',
        Response: 'False'
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .reply(401, response)

      await movies.show(req, res)

      const log = await Log.findOne({ raw: true })

      expect(log.id).to.equal(1)
      expect(log.reqTime).to.not.be.null
      expect(log.keyword).to.equal(req.params.id)
      expect(JSON.parse(log.result).data).to.deep.equal(response)

      expect(res.status.withArgs(401).calledOnce).to.be.true
      expect(res.status().json.withArgs({
        data: response,
        status: 'fail'
      }).calledOnce).to.be.true
    })

    it('should return an error (request error)', async () => {
      const req = {
        params: { id: 'tt1285016' },
        query: qs.parse('apikey=29ms9')
      }

      const res = {
        json: sinon.spy(),
        status: sinon.stub()
          .returns({
            end: sinon.spy(),
            json: sinon.spy()
          })
      }

      nock('http://www.omdbapi.com')
        .get('/')
        .query(true)
        .replyWithError({
          message: 'something went wrong',
          code: 'UNPREDICTED_ERROR'
        })

      await movies.show(req, res)

      const log = await Log.findOne({ raw: true })

      expect(log.id).to.equal(1)
      expect(log.reqTime).to.not.be.null
      expect(log.keyword).to.equal(req.params.id)
      expect(JSON.parse(log.result).data).to.be.null

      expect(res.status.withArgs(500).calledOnce).to.be.true
      expect(res.status().json.withArgs({
        status: 'fail'
      }).calledOnce).to.be.true
    })

    after(() => {
      return Log.sync({ force: true })
    })
  })
})

after(() => {
  sequelize.close()
})
