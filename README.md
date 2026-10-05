# Vlog Editor - MERN Stack Application

A full-featured Vlog & Short Video Editing Web Application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features
- **Video Editing Studio**: Video trim controls, playback speed, aspect ratio selection, canvas color, filters, text overlays, and audio integration.
- **Dark / Light Mode**: Seamless theme toggling with keyboard shortcuts.
- **Keyboard Shortcuts System**: `Space` (Play/Pause), `Ctrl+Z` (Undo), `Ctrl+Y` (Redo), `Delete` (Remove element).
- **Authentication**: JWT-based User Signup, Login, Profile State, and Session Persistence.
- **Project Management (CRUD)**: Save, load, update, list, and delete projects connected directly to MongoDB.
- **Media Uploads**: Server-side video and audio file uploads via Multer API.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, HTML5 Canvas, Vanilla CSS3 (Design Tokens, Glassmorphism), FontAwesome
- **Backend**: Node.js, Express.js, Multer (File Uploads)
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs

---

## ⚙️ Setup & Installation

### 1. Clone Repository & Install Dependencies
```bash
git clone <repository-url>
cd vlog-editor
npm install
```

### 2. Environment Variables Setup
Create a `.env` file in the root directory based on `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vlog_editor
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
```

---

## 🏃 Running the Application

### Option A: Run Full Application (Server + Static Frontend)
```bash
npm start
```
*Access the application at `http://localhost:5000`*

### Option B: Run Backend Separately
```bash
npm run start:backend
```
*Backend runs on `http://localhost:5000`*

### Option C: Run Frontend Separately
```bash
npm run start:frontend
```
*Frontend runs on `http://localhost:3000`*

---

## 📁 Repository Structure
```
├── config/             # Database connection setup
├── middleware/         # JWT Auth & Multer Upload middlewares
├── models/             # Mongoose Data Schemas (User, Project)
├── routes/             # Express API Endpoints (Auth, Project, Upload)
├── src/                # React Components & Main Application Logic
├── style.css           # UI Styling System & Theme Tokens
├── .env.example        # Environment variable template
├── .gitignore          # Git ignore rules
├── index.html          # HTML entry point
├── server.js           # Express App & Server Bootstrap
└── package.json        # Project metadata & NPM scripts
```
