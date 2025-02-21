import mongoose from 'mongoose'

// Interface defining the user schema structure
export interface TypeUser extends mongoose.Document {
  email: string
  name: string
  image: string
  sub: string
  role: 'admin' | 'user'
  watchlist: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

// Define the user schema
const userSchema = new mongoose.Schema<TypeUser>(
  {
    // User email (unique and indexed for quick lookups)
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      required: [true, 'User must have an email'],
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },

    // User full name
    name: {
      type: String,
      trim: true,
      required: [true, 'User must have a name'],
    },

    // Profile picture URL
    image: {
      type: String,
      required: [true, 'User must have a profile picture'],
    },

    // Authentication provider unique identifier (e.g., Google/Facebook ID)
    sub: {
      type: String,
      required: [true, 'User must have a sub'],
      unique: true,
    },

    // Role-based access control
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },

    // Watchlist containing movie ObjectIds
    watchlist: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Movie',
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
)

// Create and export the User model
const User = mongoose.model<TypeUser>('User', userSchema)
export default User
