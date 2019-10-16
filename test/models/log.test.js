import { expect } from 'chai'
import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers'

import Model from '../../models/log'

describe('log model', () => {
  const Log = Model(sequelize, dataTypes)
  const log = new Log()

  checkModelName(Log)('Log')

  context('properties', () => {
    ['reqTime', 'keyword', 'result'].forEach(
      checkPropertyExists(log)
    )
  })
})
