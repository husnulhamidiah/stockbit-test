import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => res.jsend.success('Hello world'))

router.use('*', (req, res) => res.jsend.fail({ code: 404, message: 'Route not found' }))
router.use((err, req, res, next) => res.jsend.fail({ code: 500, message: err.message }))

export default router
