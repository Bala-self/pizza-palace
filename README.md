# 🍕 Pizza Palace

Pizza Palace is a full-stack web application built using the **MERN Stack** (MongoDB, Express.js, React, Node.js). It provides a seamless experience for customers to browse pizzas and for administrators to manage incoming orders in real-time.

**🌐 Live Demo:** [pizza-palace-lake.vercel.app](https://pizza-palace-lake.vercel.app/)

---

## ✨ Features

### 🛒 Customer Side
- **Interactive Menu:** Browse a wide variety of pizzas with real-time price updates.
- **Cart Management:** Add, remove, or update pizza quantities easily.
- **Order Tracking:** Secure checkout process and order confirmation.
- **Responsive Design:** Optimized for mobile, tablet, and desktop views.

### 🛠 Admin Side
- **Order Dashboard:** View all incoming customer orders in a centralized panel.
- **Order Status Management:** Update order status (e.g., Preparing, Out for Delivery, Delivered).
- **Inventory Control:** (Optional/Planned) Manage pizza availability and pricing.

---

## 🚀 Tech Stack

- **Frontend:** React.js, JavaScript (ES6+), CSS/Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Deployment:** Vercel (Frontend), [Render/Heroku/Railway] (Backend)

---

## 📂 Project Structure

```text
pizza-palace/
├── backend/           # Node.js & Express server, API routes, Models
│   └── server.js      # Entry point for backend
├── frontent/          # React application (Note: Folder named 'frontent' in repo)
│   ├── src/
│   │   ├── components/# Reusable UI components
│   │   └── pages/     # Admin and Customer views
└── README.md
🛠️ Installation & Setup
To run this project locally, follow these steps:

1. Clone the repository
Bash

git clone https://github.com/Bala-self/pizza-palace.git
cd pizza-palace
2. Backend Setup
Bash

cd backend
npm install
Create a .env file in the backend directory and add:

env

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Start the server:

Bash

npm start
3. Frontend Setup
Bash

cd ../frontent
npm install
npm start
The application should now be running at http://localhost:3000.

🤝 Contributing
Contributions are welcome!

Fork the Project.
Create your Feature Branch (git checkout -b feature/AmazingFeature).
Commit your Changes (git commit -m 'Add some AmazingFeature').
Push to the Branch (git push origin feature/AmazingFeature).
Open a Pull Request.
👨‍💻 Author
Balakrishnan M

GitHub: @Bala-self
📄 License
Distributed under the MIT License. See LICENSE for more information.

text


### Next Steps:
1.  **Rename Folder:** In your repository, you have a typo in the folder name `frontent`. You might want to rename it to `frontend` using `mv frontent frontend` in your terminal to keep the project professional.
2.  **Add Images:** GitHub READMEs look great with screenshots! You can add an image of the homepage by uploading a screenshot to a `screenshots/` folder in your repo and referencing it like this: `![Homepage](./screenshots/home.png)`.
3.  **Update `.env` instructions:** If you use specific environment variables (like Stripe keys or Cloudinary), make sure to list them in the setup section.
