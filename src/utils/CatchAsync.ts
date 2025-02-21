import { NextFunction, Request, Response } from 'express'

/**
 * A higher-order function to catch and handle async errors in Express middleware.
 * @param fun - The asynchronous function to be executed.
 * @returns A function that wraps the async function and catches errors, passing them to Express error handling.
 */
export default function CatchAsync(
  fun: (
    request: Request,
    response: Response,
    next: NextFunction
  ) => Promise<any>
) {
  return function (request: Request, response: Response, next: NextFunction) {
    fun(request, response, next).catch(next) // Passes any errors to Express' global error handler
  }
}
