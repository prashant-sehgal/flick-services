import { Router } from 'express'
import * as movieController from '../controllers/movieController'
import * as userController from '../controllers/userController'

const router = Router()

// Public Routes - No authentication required
router.get('/', movieController.getAllMovies) // Fetch all movies
router.get('/:id', movieController.getMovie) // Fetch a single movie by ID

// Middleware - Authentication & Authorization required for the routes below
router.use(userController.authenticate) // Ensures user is logged in
router.use(userController.authorized) // Ensures user has proper permissions

// Protected Routes - Only authenticated & authorized users can access
router.post(
  '/',
  movieController.uploadMovieContentToMemory, // Upload movie file to memory storage
  movieController.uploadMovieContentToCloud, // Upload movie file to cloud storage
  movieController.createMovie // Create a new movie entry
)

router
  .route('/:id')
  .patch(
    movieController.uploadMovieContentToMemory, // Upload updated movie file to memory storage
    movieController.uploadMovieContentToCloud, // Upload updated movie file to cloud storage
    movieController.updateMovie // Update an existing movie entry
  )
  .delete(movieController.deleteMovie) // Delete a movie by ID

export default router
