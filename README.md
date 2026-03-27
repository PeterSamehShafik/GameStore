# 🎮 GameStore Server

## 📌 Overview
GameStore is a full-featured backend server built with **Node.js**, **Express.js**, and **MongoDB**.  
It provides a scalable system for managing games, users, and roles with secure authentication and advanced services.

---

## 🌐 Live Demo
🔗 https://gamestore777.netlify.app/

---

## 💻 Backend Repository
🔗 https://github.com/ahmedessamrizk/backend-gameStore

---

## 🚀 Features

### 👤 User
- Browse games and view details  
- Add/remove items from cart & wishlist  
- Rate games and add comments 
- Follow other users  
- Receive notifications and activity updates  

### 🛠️ Admin
- Add and remove games  
- Manage genres ( categories )

### 👑 Super Admin
- Block / unblock users and admins  
- Delete users and comments  
- Assign or remove roles  

> ⚠️ Each role inherits permissions from lower roles.

---

## 🔐 Security & Services

### 🔒 Security
- Authentication & Authorization  
- JWT tokens with **Bearer key** and expiry  
- Password hashing using **bcrypt**  
- Email confirmation before login  
- Request validation  
- Role-based access control  

### ⚙️ Services
- Social login support  
- Upload **images & videos** for:
  - Games  
  - Genres  
  - User profile pictures  
  using **Multer + Cloudinary**  
- Global error handling
- Pagination for efficient data handling  

---

## 🛠️ Technologies Used

- React.js  
- React Router DOM  
- Redux Toolkit  
- Material UI (MUI)  
- Bootstrap / React Bootstrap  
- Axios  
- JWT Authentication  

---

## 🤝 Contributing

Pull requests are welcome.  
For major changes, please open an issue first to discuss what you would like to change.

