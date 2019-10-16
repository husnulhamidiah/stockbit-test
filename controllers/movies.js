import _ from 'lodash'
import axios from 'axios'
import { Log } from '../models'

const request = axios.create({
  baseURL: 'http://www.omdbapi.com'
})

const logRequest = (keyword, { status, code, data }) => {
  return Log.create({
    reqTime: new Date(),
    keyword,
    result: JSON.stringify({ status, code, data })
  })
}

export const list = async (req, res) => {
  const allowlist = ['apikey', 's', 'type', 'y', 'page']
  const params = Object.assign({ apikey: '' }, _.pick(req.query, allowlist))

  try {
    const { status, data } = await request({ params })
    await logRequest(params.s, { data, status: 'success', code: status })
    return res.status(status).json({ data, status: 'success' })
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response
      await logRequest(params.s, { data, status: 'fail', code: status })
      return res.status(status).json({ data, status: 'fail' })
    } else if (error.request) {
      await logRequest(params.s, { data: null, status: 'fail', code: 500 })
      return res.status(500).json({ status: 'fail' })
    } else {
      await logRequest(params.s, { data: null, status: 'fail', code: 500 })
      return res.status(500).json({ message: error.message, status: 'fail' })
    }
  }
}

export const show = async (req, res) => {
  const { id } = req.params
  const { apikey } = req.query
  const params = { i: id, apikey }

  try {
    const { status, data } = await request({ params })
    await logRequest(id, { data, status: 'success', code: status })
    return res.status(status).json({ data, status: 'success' })
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response
      await logRequest(id, { data, status: 'fail', code: status })
      return res.status(status).json({ data, status: 'fail' })
    } else if (error.request) {
      await logRequest(id, { data: null, status: 'fail', code: 500 })
      return res.status(500).json({ status: 'fail' })
    } else {
      await logRequest(id, { data: null, status: 'fail', code: 500 })
      return res.status(500).json({ message: error.message, status: 'fail' })
    }
  }
}

export default {
  list,
  show
}
