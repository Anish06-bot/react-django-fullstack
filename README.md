# 🏋️‍♂️ FitFusion – Fullstack Gym Management Web App

Welcome to **FitFusion**, a modern, fullstack gym management platform developed using **React** for the frontend and **Django** for the backend. This app provides a seamless experience for gym users and admins, enabling user registration, login, OTP-based password recovery, and a rich dashboard for managing gym-related data.

---

## 🔥 Key Highlights

- 🔐 **Secure Email OTP Authentication**
- 🎯 **User Registration & Login**
- 🧠 **Forgot Password with Email OTP**
- 📊 **Interactive Dashboard**
- 🛒 **Gym Products & Services Listing**
- 🧑‍💼 **Admin Features Coming Soon**
- ⚙️ **Modular & Scalable Codebase**
- 💡 **Clean UI/UX with Responsive Design**

---

## 🌐 Tech Stack

| Frontend        | Backend         | Tools & Utilities     |
|-----------------|------------------|------------------------|
| React.js        | Django + DRF     | Git & GitHub           |
| Axios           | Django REST API  | VS Code                |
| React Router    | JWT Auth         | Postman for API tests  |
| Tailwind/CSS    | Email SMTP (OTP) | MySQL/PostgreSQL       |

---

## 🧩 Features in Detail

### 👤 User Authentication
- Register using email + phone number
- Login with JWT token system
- Forgot password via email-based OTP
- OTP verification + password reset securely

### 🖥️ Frontend (React)
- Beautiful sidebar navigation
- Dynamic dashboard with statistics
- Pages: Home, Products, Orders, Reports, Users, Settings
- Mobile-responsive layout
- Clean logout experience

### 🚀 Backend (Django)
- Django REST Framework-based API
- Custom user model with OTP logic
- Email sending via SMTP (Gmail/Yahoo)
- Auth endpoints: register, login, verify OTP, reset password
- Modular apps: `users`, `products`, `orders`
