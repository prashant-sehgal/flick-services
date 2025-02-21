import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'

// Ensure the connection string is provided
const connectionString = process.env.AZURE_CONNECTION_STRING
if (!connectionString) {
  throw new Error(
    'AZURE_CONNECTION_STRING is missing in environment variables.'
  )
}

// Initialize Azure Blob Service Client
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString)

// Define container clients for different storage needs
export const mediaContainerClient: ContainerClient =
  blobServiceClient.getContainerClient('media')

export const imagesContainerClient: ContainerClient =
  blobServiceClient.getContainerClient('images')

console.log('[INFO] Azure Blob Storage initialized successfully')
