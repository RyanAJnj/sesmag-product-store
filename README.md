# 🛒 SESMAG Product Store

A full-stack web application built using the PERN stack (PostgreSQL, Express.js, React, Node.js), enhanced with user authentication, rate-limiting protection, and custom frontend styling. This app was developed as part of an academic project to support all SESMAG personas, with special attention to DAV’s needs.

## 📌 Features

- 🧾 View, add, and delete products (authenticated users only)  
- 🔐 User login system with hashed passwords and JWT auth  
- 🧠 Arcjet integration for bot protection and rate-limiting  
- 💡 Responsive React frontend with light/dark mode toggle  
- 👥 Role-based homepage logic (guest vs. authenticated user)  
- 📦 PostgreSQL backend with secure schema setup  

## ⚙️ Tech Stack

- **Frontend:** React, Tailwind CSS (via DaisyUI)  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL (locally or via Neon)  
- **Security:** bcrypt, helmet, CORS, Arcjet  
- **Auth:** JWT (JSON Web Token)  

## 🌐 Environment Variables

Create a `.env` file in your `backend` directory with the following:

```
PORT=3000
PGUSER=your_pg_user
PGPASSWORD=your_pg_password
PGHOST=localhost
PGDATABASE=your_database_name
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
JWT_SECRET=your_super_secret_key
```

## 🚀 How to Run Locally

1. Clone the repo  
2. Run `npm install` in both `/frontend` and `/backend`  
3. Set up PostgreSQL and create the required tables  
4. Create a `.env` file with the variables above  
5. Start the backend: `nodemon server.js`  
6. Start the frontend: `npm run dev`  
7. Visit `http://localhost:5173` in your browser  

## 🧠 AI Integration

This app was developed with assistance from ChatGPT to speed up backend design, authentication logic, and frontend scaffolding. Code suggestions were adapted and customized to suit the SESMAG specification, especially for DAV users.

## 📎 Notes

- Currently focuses on the **employee-side experience** (not yet complete for guest users)  
- Cart functionality is in progress  
- Clean file structure using React components, stores, and Express routes  
