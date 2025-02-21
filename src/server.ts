// Load environment variables from .env file
import dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })

// Import required modules
import mongoose from 'mongoose'
import app from './app'

// Handle unexpected errors that are not caught by try-catch blocks
process.on('uncaughtException', function (error) {
  console.error('[ERROR] Uncaught Exception:', error)
  process.exit(1) // Exit process to prevent unstable state
})

// Connect to MongoDB using the URI from environment variables
mongoose.connect(process.env.MONGODB_URI || '').then((data) => {
  console.log('[INFO] Database connected')
  console.log(`[INFO] Database connection state: ${data.connection.readyState}`) // Log connection status
})

// Start the Express server
const server = app.listen(process.env.PORT, function () {
  console.log(
    `[INFO] Flick Backend is up and running!\n[INFO] Server running on port 8000`
  )
})

// Handle rejected promises that are not caught anywhere in the application
process.on('unhandledRejection', function (reason) {
  console.error('[ERROR] Unhandled Rejection:', reason)
  server.close(() => {
    process.exit(1) // Gracefully shut down the server on unhandled promise rejections
  })
})
