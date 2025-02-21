# Flick-Services

Flick-Services is the backend API for the Flick OTT platform, built using Node.js, Express, MongoDB, and Azure Cloud for media storage and streaming.

## 🚀 Features

- **User Authentication & Authorization** (JWT-based)
- **Movie CRUD Operations** (Create, Read, Update, Delete)
- **Media Upload to Azure Cloud** (Multer + Sharp for images, Azure Blob Storage for videos)
- **Movie Streaming** (Byte-range streaming from Azure Blob Storage)
- **User Watchlist Management** (Add/Remove movies)
- **Admin Role-Based Access Control**

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Cloud Storage:** Azure Blob Storage
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer, Sharp
- **Hosting:** Render (API), Vercel (Frontend)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/prashant-sehgal/flick-services.git
   cd flick-services
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add the following:
   ```env
   NODE_ENV=development/production
   PORT=5000
   CLIENT_ORIGIN=client_hostPurl
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   AZURE_CONNECTION_STRING=your_azure_blob_storage_connection
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## 🚦 API Endpoints

### 🔐 Authentication

| Method | Endpoint                        | Description                         |
| ------ | ------------------------------- | ----------------------------------- |
| POST   | /api/users/signin               | Sign in (Create user if not exists) |
| GET    | /api/users/watchlist            | Get user's watchlist                |
| PATCH  | /api/users/watchlist/:operation | Add/Remove movie from watchlist     |

### 🎬 Movies

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| GET    | /api/movies     | Get all movies               |
| GET    | /api/movies/:id | Get single movie by ID       |
| POST   | /api/movies     | Create a new movie (Admin)   |
| PATCH  | /api/movies/:id | Update movie details (Admin) |
| DELETE | /api/movies/:id | Delete a movie (Admin)       |

### 🎥 Media Upload & Streaming

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | /api/stream/:media | Stream movie from Azure |

## 🚀 Deployment

This project is deployed using:

- **Backend:** [Render](https://render.com/)
- **Frontend:** [Vercel](https://vercel.com/)
- **Database:** MongoDB Atlas
- **Media Storage:** Azure Blob Storage

## 📝 License

This project is licensed under the **MIT License**.

## 🤝 Contributing

Feel free to fork the repo, create issues, and submit pull requests!

## 🌟 Acknowledgments

Thanks to the open-source community for providing awesome tools and libraries!

---

Developed with ❤️ by Prashant Sehgal 🚀
