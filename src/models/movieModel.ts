import mongoose from 'mongoose'
import slugify from 'slugify'

// Interface defining the movie schema structure
export interface TypeMovie extends mongoose.Document {
  title: string
  description: string
  genres: string[]
  duration: number
  imdbRating: number
  releasedYear: number
  featured: boolean
  slug: string
  card: string
  poster: string
  media: string
}

// Movie schema definition
const movieSchema = new mongoose.Schema<TypeMovie>({
  // Movie title with unique indexing for quick lookups
  title: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    unique: true,
    required: [true, 'Movie must have a title'],
  },

  // Movie description
  description: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'Movie must have a description'],
  },

  // List of genres (at least one required)
  genres: {
    type: [String],
    trim: true,
    lowercase: true,
    validate: {
      validator: (v: string[]) => v.length > 0,
      message: 'At least one genre is required',
    },
    required: [true, 'Movie must have genres'],
  },

  // Movie duration in minutes
  duration: {
    type: Number,
    required: [true, 'Movie must have a duration'],
  },

  // IMDb rating (must be between 0 and 10)
  imdbRating: {
    type: Number,
    min: [0, 'IMDB rating cannot be less than 0'],
    max: [10, 'IMDB rating cannot be more than 10'],
    required: [true, 'Movie must have an IMDB rating'],
  },

  // Release year of the movie
  releasedYear: {
    type: Number,
    required: [true, 'Movie must have a release year'],
  },

  // Whether the movie is featured or not (default: false)
  featured: {
    type: Boolean,
    default: false,
  },

  // Slug for SEO-friendly URLs
  slug: {
    type: String,
    index: 1,
  },

  // Movie card image URL
  card: {
    type: String,
    required: [true, 'Movie must have a card'],
  },

  // Movie poster image URL
  poster: {
    type: String,
    required: [true, 'Movie must have a poster'],
  },

  // Movie media file URL
  media: {
    type: String,
    required: [true, 'Movie must have media'],
  },
})

// Middleware: Generate a slug from the title before saving
movieSchema.pre('save', function (this: TypeMovie, next) {
  if (!this.isModified('title')) return next()
  this.slug = slugify(this.title)
  next()
})

// Function to lowercase genres if modified
const lowercaseGenres = function (
  this: TypeMovie,
  next: mongoose.CallbackWithoutResultAndOptionalError
) {
  if (this.genres && Array.isArray(this.genres)) {
    this.genres = this.genres.map((genre: string) => genre.toLowerCase().trim())
  }
  next()
}

// Middleware for save and create
movieSchema.pre<TypeMovie>('save', function (next) {
  if (this.isModified('genres')) {
    lowercaseGenres.call(this, next)
  } else {
    next()
  }
})

// Middleware for update operations
const updateMiddleware = function (
  this: any,
  next: mongoose.CallbackWithoutResultAndOptionalError
) {
  const update = this.getUpdate()
  if (update?.genres && Array.isArray(update.genres)) {
    update.genres = update.genres.map((genre: string) =>
      genre.toLowerCase().trim()
    )
  }
  next()
}

movieSchema.pre('findOneAndUpdate', updateMiddleware)
movieSchema.pre('updateOne', updateMiddleware)
movieSchema.pre('updateMany', updateMiddleware)

// Create and export the Movie model
const Movie = mongoose.model('Movie', movieSchema)
export default Movie
