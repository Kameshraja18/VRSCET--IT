# College Management System

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)](https://www.mongodb.com/mern-stack)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v18+-blue)](https://reactjs.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)

A comprehensive MERN stack-based College Management System that helps manage academic activities, student information, faculty details, and administrative tasks. This system streamlines the management of educational institutions by providing a centralized platform for administrators, faculty, and students.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/college-management-system)

## Features

### Admin Features
- 👨‍🏫 **Mentorship Management**: Assign multiple students to faculty mentors for personalized growth tracking
- 📊 **Advanced Attendance**: Real-time tracking with analytics and CSV export
- 🔐 **Role-Based Access Control**: Secure dashboards for different user types
- 👥 **Student & Faculty Management**: Complete CRUD operations
- 📚 **Subject & Branch Management**: Academic structure configuration
- 📝 **Notice Management**: Announcements and communications
- 📅 **Timetable Management**: Schedule organization
- 📄 **Audit Logging**: System activity tracking

### Faculty Features
- 👨‍🏫 **Mentorship Dashboard**: View and manage assigned students
- 📊 **Attendance Management**: Mark and track student attendance
- 📚 **Study Materials**: Upload and organize course resources
- 👥 **Student Information**: Access student details and progress
- 📝 **Query Response**: Handle student inquiries
- 📅 **Timetable Access**: View class schedules

### Student Features
- 👨‍🏫 **Mentor Access**: Connect with assigned faculty mentor
- 📊 **Attendance Tracking**: View personal attendance records
- 📚 **Study Materials**: Access course resources
- 📝 **Query Submission**: Ask questions to faculty
- 📅 **Timetable View**: Access class schedules
- 📈 **Academic Progress**: Track grades and performance

## Tech Stack

- **Frontend**: React.js 18, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Vercel (Frontend + Backend)
- **File Upload**: Multer for media management
- **Email**: Nodemailer for notifications

## Prerequisites

- Node.js 16+
- MongoDB (Local or Atlas)
- npm or yarn
- Git

## ⚡ Vercel Deployment Guide

### 1. **Prepare Your Repository**
```bash
# Clone and setup
git clone <your-repo-url>
cd college-management-system

# Install dependencies
npm run install:all  # Installs both frontend and backend deps
```

### 2. **Environment Variables Setup**
Create environment variables in Vercel dashboard or `.env` files:

#### Backend Environment Variables:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college-management
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
PORT=4000
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://your-app.vercel.app
UPLOAD_PATH=./media
MAX_FILE_SIZE=5242880
```

#### Frontend Environment Variables:
```env
REACT_APP_APILINK=https://your-app.vercel.app/api
```

### 3. **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### 4. **Database Setup**
- Use MongoDB Atlas for production
- Run the admin seeder after deployment:
```bash
vercel env pull .env.local
npm run seed
```

## 🛠️ Local Development Setup

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd College-Management-System

# Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Install all dependencies
npm run install:all

# Start development servers
npm run dev:all
```

### Manual Setup
1. **Backend Setup**:
```bash
cd backend
npm install
cp .env.example .env  # Configure your variables
npm run dev
```

2. **Frontend Setup**:
```bash
cd frontend
npm install
cp .env.example .env.local  # Configure your variables
npm start
```

3. **Database**:
```bash
# Create admin account
cd backend
npm run seed
```

## 📁 Project Structure

```
college-management-system/
├── 📁 backend/
│   ├── 📁 controllers/     # Business logic
│   ├── 📁 models/         # Database schemas
│   ├── 📁 routes/         # API endpoints
│   ├── 📁 middlewares/    # Authentication & validation
│   ├── 📁 utils/          # Helper functions
│   ├── 📁 media/          # File uploads
│   └── 📄 package.json
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/  # Reusable UI components
│   │   ├── 📁 Screens/     # Page components
│   │   ├── 📁 utils/       # API clients & helpers
│   │   └── 📄 App.jsx      # Main app component
│   └── 📄 package.json
├── 📄 vercel.json         # Vercel configuration
├── 📄 .gitignore         # Git ignore rules
└── 📄 README.md
```

## 🔧 Available Scripts

### Root Level Scripts
```bash
npm run install:all    # Install all dependencies
npm run dev:all        # Start both servers
npm run build:all      # Build for production
```

### Backend Scripts
```bash
npm run dev           # Development server
npm run start         # Production server
npm run seed          # Create admin account
```

### Frontend Scripts
```bash
npm start             # Development server
npm run build         # Production build
npm run build:analyze # Bundle analysis
```

## 🚀 Performance Optimizations

### Vercel-Specific Optimizations
- ✅ **Automatic scaling** and CDN
- ✅ **Edge functions** for API routes
- ✅ **Static asset optimization**
- ✅ **Automatic HTTPS** and SSL
- ✅ **Global CDN** distribution

### Code Optimizations
- ✅ **Lazy loading** for components
- ✅ **Code splitting** with React.lazy()
- ✅ **Image optimization** and compression
- ✅ **Bundle analysis** tools included
- ✅ **Efficient caching** strategies

### Database Optimizations
- ✅ **Indexed queries** for fast lookups
- ✅ **Connection pooling** with MongoDB
- ✅ **Efficient aggregation** pipelines
- ✅ **Proper schema design**

## 🔒 Security Features

- **JWT Authentication** with secure tokens
- **Role-based access control** (Admin/Faculty/Student)
- **Password hashing** with bcrypt
- **Input validation** and sanitization
- **CORS protection**
- **Rate limiting** capabilities
- **Secure file uploads**

## 📊 Default Admin Credentials

After running the seeder, use these credentials:

- **Email**: admin@gmail.com
- **Password**: admin123
- **Role**: Administrator

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:

- 📧 **Email**: krishjotaniya71@gmail.com
- 🌐 **Website**: [krishjotaniya.netlify.app](http://krishjotaniya.netlify.app/)
- 💼 **LinkedIn**: [krishjotaniya](https://www.linkedin.com/in/krishjotaniya/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**⭐ Star this repo if you found it helpful!**

- Node.js
- MongoDB
- npm

## Setup Instructions

Project Setup Video Tutorial: https://youtu.be/gw4jh4RHzuo

Sample .env file is added in both backend and frontend, copy that variables and create `.env` in both the folders and then follow below given instructions

1. Clone the repository:

```bash
git clone <repository-url>
cd College-Management-System
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:

```
MONGODB_URI =mongodb://127.0.0.1:27017/College-Management-System
PORT = 4000
FRONTEND_API_LINK = http://localhost:3000
JWT_SECRET = THISISSECRET

NODEMAILER_EMAIL =
NODEMAILER_PASS =
```

4. Create a `.env` file in the frontend directory:

```env
REACT_APP_APILINK = http://localhost:4000/api

REACT_APP_MEDIA_LINK = http://localhost:4000/media

```

5. Start the development servers:

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm start
```

## Initial Setup

1. Create an admin account using the seeder:

```bash
cd backend
npm run seed
```

This will create a default admin account with the following credentials:

- Employee ID: 123456
- Password: admin123
- Email: admin@gmail.com

## Project Structure

```
college-management-system/
├── backend/
│   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── media/
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── public/
└── README.md
```

## For Any Doubt Feel Free To Contact Me 🚀

- [My Website](http://krishjotaniya.netlify.app/)
- [Linkedin](https://www.linkedin.com/in/krishjotaniya/)
- [krishjotaniya71@gmail.com](mailto:krishjotaniya71@gmail.com)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
