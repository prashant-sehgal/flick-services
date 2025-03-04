// Import required modules
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// Import route handlers
import movieRouter from './routes/movieRoutes'
import userRouter from './routes/userRoutes'
import streamRouter from './routes/streamRoutes'

// Import global error handler middleware
import GlobalErrorHandler from './utils/GlobalErrorHandler'

// Initialize Express application
const app = express()

// Middleware to parse cookies from incoming requests
app.use(cookieParser())

// Enable Cross-Origin Resource Sharing (CORS) for client-side requests
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, // Allow requests from the specified client origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
)

// Enable request logging in development mode
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

// Middleware to parse incoming JSON requests
app.use(express.json())

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }))

// Mount routers for different API endpoints
app.use('/api/v1/movies', movieRouter) // Handles movie-related routes
app.use('/api/v1/users', userRouter) // Handles user-related routes
app.use('/api/v1/streams', streamRouter) // Handles media streaming routes

// Global error handling middleware
app.use(GlobalErrorHandler)

// Export the configured Express app
export default app
