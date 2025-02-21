import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/userModel'
import CatchAsync from '../utils/CatchAsync'
import AppError from '../utils/AppError'
import { promisify } from 'node:util'

/**
 * @desc Fetches the watchlist of the authenticated user
 * @route GET /api/users/watchlist
 * @access Private
 */
export const getWatchlist = CatchAsync(async function (
  request: Request,
  response: Response
) {
  // Populate watchlist with movie details
  await request.user.populate('watchlist', 'title slug card')

  return response.status(200).json({
    status: 'success',
    data: { watchlist: request.user.watchlist },
  })
})

/**
 * @desc Updates the user's watchlist (Add or Remove a movie)
 * @route PATCH /api/users/watchlist/:operation
 * @access Private
 */
export const updateWatchlist = CatchAsync(async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { movieId } = request.body
  const { operation } = request.params

  // Validate movieId presence
  if (!movieId) return next(new AppError('Please provide a movieId', 400))

  const user = request.user
  if (!user) return next(new AppError('User not found', 401))

  // Add movie to watchlist
  if (operation === 'add' && !user.watchlist.includes(movieId)) {
    user.watchlist.push(movieId)
  }

  // Remove movie from watchlist
  if (operation === 'remove') {
    user.watchlist = user.watchlist.filter((id) => id.toString() !== movieId)
  }

  // Save changes without validation checks
  await user.save({ validateBeforeSave: false })

  // Populate watchlist with movie details
  await user.populate('watchlist', 'title slug card')

  return response.json({
    status: 'success',
    data: { watchlist: user.watchlist },
  })
})

/**
 * @desc Signs in a user (Creates account if not exists)
 * @route POST /api/users/signin
 * @access Public
 */
export const signin = CatchAsync(async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { sub, email, name, image } = request.body

  // Ensure all required details are provided
  if (!sub || !email || !name || !image)
    return next(new AppError('Please provide all details.', 401))

  // Find or create the user
  let user = await User.findOne({ email })
  if (!user) user = await User.create({ email, name, sub, image })

  return response.status(200).json({
    status: 'success',
    user,
  })
})

/**
 * @desc Middleware: Authenticates a user via JWT token
 * @route Protected Routes
 * @access Private
 */
export const authenticate = CatchAsync(async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Retrieve token from cookies or Authorization header
  const token =
    request.cookies['next-auth.session-token'] ||
    request.headers.authorization?.split(' ')[1]

  if (!token)
    return next(
      new AppError('You are not authenticated to access these routes', 401)
    )

  // Decode JWT token
  const decoded = await verifyToken(token, process.env.JWT_SECRET || '')
  if (!decoded || !decoded.email)
    return next(new AppError('Invalid token', 401))

  // Fetch user associated with token
  const user = await User.findOne({ email: decoded.email })
  if (!user)
    return next(
      new AppError('User associated with this token no longer exists.', 401)
    )

  // Check token expiration
  if (Date.now() > decoded.exp * 1000)
    return next(new AppError('Provided token is already expired', 401))

  // Attach user to request object
  request.user = user
  next()
})

/**
 * @desc Middleware: Grants access only to admin users
 * @route Protected Admin Routes
 * @access Admin
 */
export const authorized = CatchAsync(async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (request.user?.role !== 'admin')
    return next(
      new AppError('You are not authorized to access these routes', 403)
    )

  next()
})

/**
 * @desc Utility function to verify JWT token asynchronously
 * @param token - JWT token string
 * @param secret - JWT secret key
 * @returns Decoded token data
 */
const verifyToken: (token: string, secret: string) => Promise<any> = promisify(
  jwt.verify
)
