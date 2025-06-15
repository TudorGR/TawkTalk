# TawkTalk

A modern, responsive chat application built using React, Node.js, and Socket.io. This app is designed for seamless real-time communication with support for group chats, personal messages, and emoji interactions.

Feel free to explore the app live at [TawkTalk](https://tawktalk.onrender.com/)!

## Design

![400161178-e6411d6d-f4fe-4eb8-9499-10b10babfc2e](https://github.com/user-attachments/assets/7a5d14e8-a66e-4976-9567-ac36c346491e)

## Features

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

### Deployment

The application is deployed and live at: [TawkTalk](https://tawktalk.onrender.com/)

## Installation

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

   - Create a `.env` file in the `frontend` folder with the following key:
     ```env
     VITE_SERVER_URL="http://localhost:8747"
     ```
   - Create a `.env` file in the `backend` folder with the following keys:
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

   # Start the frontend server
   cd ../client
   npm start
   ```

## Technologies Used

### Frontend

- **React**: For building the user interface.
- **ShadCN**: UI components library.
- **Tailwind CSS**: For styling and responsive design.
- **Zustand**: State management.
- **Axios**: API call handling.

### Backend

- **Node.js**: Server-side runtime.
- **Express**: Web framework.
- **Socket.io**: Real-time communication.
- **Multer**: File handling.
- **MongoDB**: NoSQL database.

## Future Enhancements

- Add voice and video call features.
- Implement message reactions.
- Enhance chat search functionality.
