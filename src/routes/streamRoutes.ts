import { Router } from 'express'
import * as streamController from '../controllers/streamController'
import * as userController from '../controllers/userController'

const router = Router()

// Middleware - Authentication required for streaming
router.use(userController.authenticate) // Ensures user is logged in before accessing streams

// Stream Route - Fetch and stream media content
router.get('/:media', streamController.getStream) // Streams media file based on the provided media identifier

export default router
