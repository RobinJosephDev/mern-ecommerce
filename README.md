# 🛒 MERN Ecommerce App

A **full-stack ecommerce platform** built with the **MERN stack** (MongoDB, Express, React, Node.js). This app features product management, user authentication, a shopping cart, order tracking, and an admin dashboard.

---

## 🚀 Features

* User registration and login with **JWT authentication**
* Browse products with search and filter functionality
* Add to cart and checkout system
* Order history and tracking
* Admin panel to manage products, users, and orders
* Responsive UI using React and Tailwind CSS
* Backend API with Express and MongoDB Atlas

---

## 🧰 Tech Stack

| Layer          | Technologies Used                                         |
| -------------- | --------------------------------------------------------- |
| **Frontend**   | React, Tailwind CSS, DaisyUI, Zustand                     |
| **Backend**    | Node.js, Express.js, MongoDB, JWT, bcrypt, Helmet, Morgan |
| **Database**   | MongoDB Atlas                                             |
| **Deployment** | Vercel (Frontend), Render (Backend)                       |

---

## 🏗️ Project Structure

```
mern-ecommerce/
├── backend/          # Node + Express backend
│   ├── index.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── package.json
├── frontend/         # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── .env.example      # Example environment variables
└── README.md
```

---

## ⚙️ Backend Setup

### 1️⃣ Install Dependencies

```bash
cd backend
npm install
```

### 2️⃣ Setup MongoDB Atlas

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project and a database cluster
3. Set username and password for database user
4. Add IP address `0.0.0.0` in Network Access
5. Copy the connection string from Compass option
6. Paste it in `index.js`, replacing `<password>` with your DB password

### 3️⃣ Run Backend

```bash
node index.js
```

* Backend server will start on your specified port (default `5000`)

---

## 💻 Frontend Setup

### 1️⃣ Install Dependencies

```bash
cd frontend
npm install
```

### 2️⃣ Run Frontend

```bash
npm start
```

* Frontend runs on `http://localhost:3000`
* Admin panel included within the frontend app

---

## 📹 Video Tutorial

* Step-by-step walkthrough available on YouTube: [Click Here](https://youtu.be/9ObIuvWFaSI)

---

## 🔒 Security Highlights

* JWT authentication for secure login
* Passwords hashed with bcrypt
* Helmet and CORS configured on backend
* Input validation and sanitization

---

## 🚀 Deployment

### Frontend

* Deployed on **Vercel**
* Build using `npm run build`

### Backend

* Deployed on **Render**
* Set environment variables (MONGO_URI, JWT secrets) in Render dashboard

---

## 👤 Author

**Robin Joseph**
📧 [robinjo1776@gmail.com](mailto:robinjo1776@gmail.com)
🔗 [GitHub: RobinJosephDev](https://github.com/RobinJosephDev)
