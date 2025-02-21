import { Router } from 'express'
import * as userController from '../controllers/userController'

const router = Router()

// Public Route - No authentication required
router.post('/signin', userController.signin) // User sign-in route

// Middleware - Authentication required for all routes below
router.use(userController.authenticate) // Ensures user is logged in before accessing protected routes

// Protected Routes - Requires authentication
router.get('/watchlist', userController.getWatchlist) // Fetch user watchlist
router.patch('/watchlist/:operation', userController.updateWatchlist) // Update user watchlist (add/remove movie)

export default router
