export default class AppError extends Error {
  public status: string
  public statusCode: number

  constructor(message: string, statusCode: number) {
    super(message) // Call the parent Error class constructor with the message

    this.statusCode = statusCode // Set the HTTP status code

    // Determine error status based on statusCode (4xx -> 'fail', 5xx -> 'error')
    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error'
  }
}
