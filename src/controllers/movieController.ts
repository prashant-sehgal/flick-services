import multer from 'multer'
import sharp from 'sharp'
import * as BaseController from '../utils/BaseController'
import Movie from '../models/movieModel'
import CatchAsync from '../utils/CatchAsync'
import { NextFunction, Request, Response } from 'express'
import {
  imagesContainerClient,
  mediaContainerClient,
} from '../lib/cloudProvider'

// Define file upload fields
const fields: multer.Field[] = [
  { name: 'card', maxCount: 1 },
  { name: 'poster', maxCount: 1 },
  { name: 'media', maxCount: 1 },
]

// Define request file types
type RequestFiles = {
  card?: Express.Multer.File[]
  poster?: Express.Multer.File[]
  media?: Express.Multer.File[]
}

// Multer middleware to store files in memory
export const uploadMovieContentToMemory = multer({
  storage: multer.memoryStorage(),
}).fields(fields)

// Utility function to generate unique blob names
const generateBlobName = (prefix: string, extension: string) =>
  `${prefix}-${Math.round(
    Math.random() * 1_000_000
  )}-${Date.now()}.${extension}`

// Middleware to upload files to Azure Cloud Storage
export const uploadMovieContentToCloud = CatchAsync(async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestFiles = request.files as RequestFiles

  if (!requestFiles) {
    return next()
  }

  // Upload card image
  if (requestFiles.card) {
    request.body.card = await uploadImage(
      requestFiles.card[0].buffer,
      'cards',
      'card'
    )
  }

  // Upload poster image
  if (requestFiles.poster) {
    request.body.poster = await uploadImage(
      requestFiles.poster[0].buffer,
      'posters',
      'poster'
    )
  }

  // Upload media file
  if (requestFiles.media) {
    request.body.media = await uploadMedia(requestFiles.media[0].buffer)
  }

  next()
})

// Function to upload an image to Azure Blob Storage
async function uploadImage(buffer: Buffer, folder: string, prefix: string) {
  const blobName = generateBlobName(prefix, 'webp')
  const blockBlobClient = imagesContainerClient.getBlockBlobClient(
    `${folder}/${blobName}`
  )

  const processedBuffer = await sharp(buffer)
    .resize(folder === 'cards' ? 382 : 1920, folder === 'cards' ? 566 : 1080, {
      fit: sharp.fit.cover,
    })
    .webp({ quality: 80 })
    .toBuffer()

  await blockBlobClient.uploadData(processedBuffer, {
    blobHTTPHeaders: { blobContentType: 'image/webp' },
  })

  return blobName
}

// Function to upload media file to Azure Blob Storage
async function uploadMedia(buffer: Buffer) {
  const blobName = generateBlobName('media', 'mp4')
  const blockBlobClient = mediaContainerClient.getBlockBlobClient(blobName)

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: 'video/mp4' },
  })

  return blobName
}

// CRUD Handlers
export const getAllMovies = BaseController.getAll(Movie)
export const getMovie = BaseController.getOne(Movie)
export const createMovie = BaseController.createOne(Movie)
export const updateMovie = BaseController.updateOne(Movie)
export const deleteMovie = BaseController.deleteOne(Movie)
