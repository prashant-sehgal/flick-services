import { NextFunction, Request, Response } from 'express'
import CatchAsync from '../utils/CatchAsync'
import { mediaContainerClient } from '../lib/cloudProvider'
import AppError from '../utils/AppError'

export const getStream = CatchAsync(async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const range = request.headers.range
  if (!range) {
    return next(new AppError('Requires Range header', 400))
  }

  const blobName = request.params.media
  const blockBlobClient = mediaContainerClient.getBlockBlobClient(blobName)

  try {
    // Get file properties
    const properties = await blockBlobClient.getProperties()
    const fileSize = properties.contentLength || 0
    const contentType = properties.contentType || 'video/mp4'

    // Validate and parse range header
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-')
    const start = parseInt(startStr, 10) || 0
    const end = Math.min(
      endStr ? parseInt(endStr, 10) : start + 1 * 1024 * 1024 - 1, // Default chunk size: 1MB
      fileSize - 1
    )

    if (start >= fileSize || start < 0 || end < start) {
      return next(new AppError('Invalid range request', 416))
    }

    const chunkSize = end - start + 1

    // Set response headers
    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': contentType,
    })

    // Stream the requested chunk
    const downloadResponse = await blockBlobClient.download(start, chunkSize)
    const stream = downloadResponse.readableStreamBody

    if (!stream) {
      return next(
        new AppError('Failed to get readable stream from Azure Blob', 500)
      )
    }

    stream.pipe(response)
  } catch (error) {
    console.error('Azure Blob Streaming Error:', error)
    return next(new AppError('Error fetching media file', 500))
  }
})
