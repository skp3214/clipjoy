# 🎬 ClipJoy

ClipJoy is a **Next.js**-based 📽️ application for **sharing reels** 🎥 with users. It allows users to **upload**, **view**, and **interact** 👏 with **short videos** ⏩. The project is built with **Next.js**, **NextAuth** 🔐 for authentication, and **ImageKit** 🖼️ for video uploads.

## [Live Website Link](https://clipsjoy.vercel.app/)
## ⭐ Features

- **User Authentication** 🔑 with **NextAuth**
- **Video Uploads** 📤 using **ImageKit**
- **Secure Password Hashing** 🔒 with **bcryptjs**
- **Video Metadata Storage** 🗄️ using **MongoDB & Mongoose**
- **Styled** 🎨 with **TailwindCSS & DaisyUI**
- **Form Handling** 📄 with **React Hook Form**

## 🛠️ Tech Stack

- **Frontend:** 🎭 Next.js, React, TailwindCSS, DaisyUI
- **Backend:** 🏗️ Next.js API routes, NextAuth
- **Database:** 🗂️ MongoDB (**Mongoose ODM**)
- **Storage:** 🏞️ ImageKit
- **Authentication:** 🔑 NextAuth (**JWT-based authentication**)
- **State Management:** 📦 React Hook Form

## 🚀 Installation

1. **Clone the Repository** 📂:
   ```sh
   git clone https://github.com/skp3214/clipjoy.git
   cd clipjoy
   ```
2. **Install Dependencies** 📦:
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Set Up Environment Variables** 🌍:
   - Create a `.env.local` file and add the following:
   ```env
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   MONGODB_URI=your_mongodb_connection_string
   IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_PRIVATE_KEY=your_private_key
   IMAGEKIT_URL_ENDPOINT=your_url_endpoint
   ```
4. **Run the Development Server** 🏃:
   ```sh
   npm run dev
   ```

## 📂 Folder Structure

```
clipjoy/
│── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── register/
│   │   ├── videos/
│   ├── components/
│   ├── login/
│   ├── register/
│   ├── upload/
│── lib/
│   ├── api-client.ts
│   ├── auth.ts
│   ├── db.ts
│── models/
│   ├── User.ts
│   ├── Video.ts
│── public/
│── styles/
│── pages/
│── .env.local
│── next.config.js
│── package.json
```

## 🔗 API Routes

| 🌐 Route            | 🔄 Method | 📜 Description         |
|--------------------|----------|----------------------|
| `/api/videos`      | **GET**  | Fetch all videos 📹 |
| `/api/auth/session`| **GET**  | Get user session 🔑 |
| `/api/auth/signin` | **POST** | User login 🚪       |
| `/api/auth/signup` | **POST** | User registration 📝 |

## 🔮 Future Enhancements

- **Admin Dashboard** 🛠️ for managing videos & users
- **Like & Comment System** ❤️💬 for user engagement
- **Video Categories & Tags** 🏷️ for better content organization
- **Performance Optimization** ⚡ with caching and SSR

## 🤝 Contributing

Pull requests are welcome! 🚀 For major changes, please open an **issue** 🗂️ first to discuss what you would like to change.


# [Learning](/Learning.md)

