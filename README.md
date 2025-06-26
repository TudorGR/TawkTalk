# 💬 TawkTalk

A modern, responsive chat application built using React, Node.js, and Socket.io. This app is designed for seamless real-time communication with support for group chats, personal messages, and emoji interactions.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://tawktalk.onrender.com/)

Feel free to explore the app live at [TawkTalk](https://tawktalk.onrender.com/)!

## 📋 Table of Contents

- [Design](#design)
- [Features](#features)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [Contact](#contact)

## 🎨 Design

![TawkTalk Design](https://github.com/user-attachments/assets/7a5d14e8-a66e-4976-9567-ac36c346491e)

## ✨ Features

### Frontend

- **Framework**: React
- **UI Components**: ShadCN
- **Styling**: Tailwind CSS
- **Responsiveness**: Fully responsive design for mobile, tablet, and desktop.
- **Authentication**: Secure JWT-based authentication.
- **File Handling**:
  - File uploads using Multer.
  - File downloads for shared files.
- **Real-time Messaging**: Powered by Socket.io for instant communication.
- **Chat Support**:
  - Group chats.
  - Personal messages.
- **Fun Conversations**: Emoji support for a lively chat experience.

### Backend

- **Framework**: Node.js and Express.
- **Database**: MongoDB for reliable data storage.
- **State Management**: Zustand for efficient state management.
- **API Calls**: Axios for handling client-server interactions.
- **Real-time Communication**: Socket.io for instant messaging functionality.
- **Security**: JWT authentication and authorization.

## 📸 Screenshots

<details>
<summary>Click to view application screenshots</summary>

<!-- Add your screenshots here -->

_Coming soon_

</details>

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/TudorGR/TawkTalk.git
   cd TawkTalk
   ```

2. Install dependencies:

   ```bash
   # For the frontend
   cd client
   npm install

   # For the backend
   cd ../server
   npm install
   ```

3. Configure the environment variables:

   - Create a `.env` file in the `client` folder with the following key:
     ```env
     VITE_SERVER_URL="http://localhost:8747"
     ```
   - Create a `.env` file in the `server` folder with the following keys:
     ```env
     DATABASE_URL=your-database-url
     JWT_KEY=your-jwt-key
     PORT=8747
     ```

4. Start the development servers:

   ```bash
   # Start the backend server
   cd server
   npm run dev

   # Start the frontend server (in a new terminal)
   cd ../client
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## 🛠️ Technologies Used

### Frontend

- **React**: For building the user interface.
- **ShadCN**: UI components library.
- **Tailwind CSS**: For styling and responsive design.
- **Zustand**: State management.
- **Axios**: API call handling.
- **Vite**: Build tool for faster development.

### Backend

- **Node.js**: Server-side runtime.
- **Express**: Web framework.
- **Socket.io**: Real-time communication.
- **Multer**: File handling.
- **MongoDB**: NoSQL database.
- **JWT**: Authentication and authorization.

## 📂 Project Structure

```
TawkTalk/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/         # Static assets
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Application pages
│   │   └── store/          # State management
├── server/                 # Backend Node.js application
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── uploads/            # Uploaded files
```

## 🚀 Future Enhancements

- Add voice and video call features.
- Implement message reactions.
- Enhance chat search functionality.
- Add message threading for organized conversations.
- Implement end-to-end encryption for enhanced privacy.
- Add typing indicators for better user experience.
- Support for dark/light mode themes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Contact

Tudor Gradinaru - [GitHub Profile](https://github.com/TudorGR)

Project Link: [https://github.com/TudorGR/TawkTalk](https://github.com/TudorGR/TawkTalk)
