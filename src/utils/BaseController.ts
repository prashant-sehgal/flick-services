import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import CatchAsync from './CatchAsync'
import AppError from './AppError'
import APIFeatures from './APIFeatures'

/**
 * Retrieve all documents from a given Mongoose model with filtering, sorting, field limiting, and pagination.
 * @param Model - The Mongoose model to query.
 */
export const getAll = function (Model: mongoose.Model<any>) {
  return CatchAsync(async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // Apply API features (filtering, sorting, field limiting, pagination)
    const apiFeatures = new APIFeatures(Model.find(), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const documents = await apiFeatures.query

    return response.status(200).json({
      status: 'success',
      results: documents.length,
      data: {
        documents,
      },
    })
  })
}

/**
 * Retrieve a single document by ID.
 * @param Model - The Mongoose model to query.
 */
export const getOne = function (Model: mongoose.Model<any>) {
  return CatchAsync(async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // Apply field limiting
    const apiFeatures = new APIFeatures(
      Model.findById(request.params.id),
      request.query
    ).limitFields()

    const document = await apiFeatures.query

    // If no document is found, return a 404 error
    if (!document) {
      return next(new AppError('No document found with that ID', 404))
    }

    return response.status(200).json({
      status: 'success',
      data: {
        document,
      },
    })
  })
}

/**
 * Create a new document in the database.
 * @param Model - The Mongoose model to use for creation.
 */
export const createOne = function (Model: mongoose.Model<any>) {
  return CatchAsync(async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const document = await Model.create(request.body)

    return response.status(200).json({
      status: 'success',
      data: {
        document,
      },
    })
  })
}

/**
 * Update an existing document by ID.
 * @param Model - The Mongoose model to use for updating.
 */
export const updateOne = function (Model: mongoose.Model<any>) {
  return CatchAsync(async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const document = await Model.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true } // Return updated document & run validation
    )

    // If no document is found, return a 404 error
    if (!document) {
      return next(new AppError('No document found with that ID', 404))
    }

    return response.status(200).json({
      status: 'success',
      data: {
        document,
      },
    })
  })
}

/**
 * Delete a document by ID.
 * @param Model - The Mongoose model to use for deletion.
 */
export const deleteOne = function (Model: mongoose.Model<any>) {
  return CatchAsync(async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const document = await Model.findByIdAndDelete(request.params.id)

    // If no document is found, return a 404 error
    if (!document) {
      return next(new AppError('No document found with that ID', 404))
    }

    return response.status(204).json({
      status: 'success',
      data: null, // No content response for successful deletion
    })
  })
}
