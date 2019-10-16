import { Router } from 'express'
import movies from '../controllers/movies'

const router = Router()

const wrap = fn => (...args) => fn(...args).catch(args[2])

router.get('/movies', wrap(movies.list))
router.get('/', (req, res) => res.status(200).json({ data: 'ok', status: 'success' }))

router.use('*', (req, res) => res.status(404).json({ message: 'route not found', status: 'fail' }))
router.use((err, req, res, next) => res.status(500).json({ message: err.message, status: 'fail' }))

export default router
