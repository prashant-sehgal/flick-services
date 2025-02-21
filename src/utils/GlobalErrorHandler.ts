import { NextFunction, Request, Response } from 'express'
import AppError from './AppError'

/**
 * Global error handling middleware for Express.
 * @param error - The error object (AppError or other unexpected errors).
 * @param request - The Express request object.
 * @param response - The Express response object.
 * @param next - The Express next function (for forwarding errors if needed).
 */
export default function GlobalErrorHandler(
  error: AppError,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const statusCode = error.statusCode || 500 // Default to 500 (Internal Server Error)
  const status = error.status || 'error' // Default to 'error' for server issues

  response.status(statusCode).json({
    status,
    name: error.name,
    message: error.message,
    // Include the stack trace only in non-production environments
    stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
  })
}
