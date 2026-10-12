# 🎟️ Book My Event

**Book My Event** is a modern, full-stack MERN (MongoDB, Express.js, React, Node.js) event discovery, registration, and ticketing platform. It features comprehensive event filtering, live search, wishlist management, interactive customer reviews, and secure ticket booking.

---

## ✨ Key Features

* **Advanced Event Discovery & Filtering**: Browse upcoming events by category (Technology, Music, Business, Sports, Workshops, Entertainment) with live search and sorting options (by date and price).
* **Responsive Event Details & Posters**: Clean event detail view with a responsive image display (`object-contain`) to ensure wide posters show fully without cropping.
* **User Authentication**: Secure JWT-based authentication supporting user registration, login, and role-based access permissions.
* **Wishlist / Bookmarking**: Save your favorite events to a personal wishlist for quick access and management.
* **Interactive Reviews & Ratings**: Share experiences, leave 5-star ratings, and view average scores for events.
* **Dynamic Booking System**: Instant registration and seat availability tracking with real-time updates directly from a personalized user dashboard.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Vite, Tailwind CSS, React Icons, React Router DOM
* **Backend**: Node.js, Express.js
* **Database**: MongoDB & Mongoose

---

## 📁 Project Structure

```text
Book-My-Event-MERN/
├── client/          # React frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
└── server/          # Node.js & Express backend
    ├── controllers/
    ├── middleware/
    ├── models/
    └── routes/