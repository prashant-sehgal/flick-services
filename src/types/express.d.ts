import express from 'express'
import { TypeUser } from '../models/userModel'

/**
 * Extends the Express Request interface to include a `user` property.
 * This ensures TypeScript recognizes `req.user` as a valid property when handling authentication.
 */
declare global {
  namespace Express {
    interface Request {
      user: TypeUser // Adds a `user` property to the Request object, containing user details
    }
  }
}
