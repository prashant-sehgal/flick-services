import { Query } from 'mongoose'

// Define the shape of the query parameters object
type QueryObject = {
  sort?: string
  fields?: string
  page?: string
  limit?: string
}

export default class APIFeatures {
  constructor(
    public query: Query<any[], any, {}, any, 'find', {}>, // Mongoose query object
    public queryObject: QueryObject // Query parameters received from request
  ) {}

  // Method to filter results based on query parameters
  filter() {
    const queryObjectCopy: any = { ...this.queryObject } // Create a shallow copy of query params

    // Fields to exclude from filtering (as they are used for other purposes)
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((field) => delete queryObjectCopy[field])

    // Convert filter operators (gte, gt, lte, lt) into MongoDB query format ($gte, $gt, etc.)
    const filterObject = JSON.parse(
      JSON.stringify(queryObjectCopy).replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      )
    )

    this.query.find(filterObject) // Apply the filtering conditions to the Mongoose query
    return this
  }

  // Method to sort query results
  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.toString().split(',').join(' ') // Convert to MongoDB sorting format
      this.query.sort(sortBy)
    } else {
      this.query.sort('-createdAt') // Default sorting by newest entries first
    }
    return this
  }

  // Method to limit returned fields (for selective data retrieval)
  limitFields() {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.toString().split(',').join(' ') // Convert to MongoDB projection format
      this.query.select(fields)
    } else {
      this.query.select('-__v') // Exclude MongoDB version field by default
    }
    return this
  }

  // Method to paginate results
  paginate() {
    const page = Number(this.queryObject.page) || 1 // Default to page 1
    const limit = Number(this.queryObject.limit) || 50 // Default limit of 50 results per page
    const skip = (page - 1) * limit // Calculate the number of documents to skip

    this.query.skip(skip).limit(limit) // Apply pagination to the query
    return this
  }
}
