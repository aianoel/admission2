# School Enrollment Management System

A comprehensive school management system built with React, TypeScript, and Express.js. This system provides role-based dashboards for administrators, teachers, students, parents, and other school staff.

## Features

### 🎯 Multi-Role Dashboard System
- **Admin Dashboard**: Complete system control, user management, and configuration
- **Principal Dashboard**: School oversight and administrative functions  
- **Academic Coordinator**: Curriculum management and teacher assignments
- **Teacher Dashboard**: Class management, grading, and student interaction
- **Student Dashboard**: Course enrollment, grades, and assignments
- **Parent Dashboard**: Child progress monitoring and communication
- **Registrar Dashboard**: Student records and enrollment management
- **Accounting Dashboard**: Fee management and financial tracking
- **Guidance Dashboard**: Student counseling and support services

### 🚀 Key Capabilities
- **Real-time Chat System**: Facebook-style messaging between users
- **Payment Integration**: Student fee management and payment processing
- **File Management**: Document upload and sharing system
- **Grade Management**: Comprehensive grading and assessment tools
- **Enrollment Portal**: Online student registration and enrollment
- **Landing Page**: Public-facing school information and announcements
- **Responsive Design**: Mobile-friendly interface with modern UI

### 🛠 Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Auth with JWT
- **Real-time**: Socket.io for live chat and notifications
- **File Storage**: Google Cloud Storage integration
- **Build Tool**: Vite for fast development and building

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Firebase project (for authentication)
- Google Cloud Storage (for file uploads)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aianoel/admission2.git
cd admission2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL=postgresql://username:password@hostname:port/database_name

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Server Configuration
NODE_ENV=development
PORT=5000
SESSION_SECRET=your_session_secret

# Optional: Additional Services
OPENAI_API_KEY=your_openai_key
GOOGLE_CLOUD_PROJECT_ID=your_gcp_project
GOOGLE_CLOUD_BUCKET=your_storage_bucket
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utility libraries
├── server/                # Express backend
│   ├── routes/           # API routes
│   ├── auth/             # Authentication logic
│   └── middleware/       # Express middleware
├── shared/               # Shared types and schemas
└── public/              # Static assets
```

## Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Setup
- Configure production database
- Set up Firebase project
- Configure Google Cloud Storage
- Update environment variables

## User Roles & Permissions

### Administrator
- Full system access
- User management
- System configuration
- Reports and analytics

### Principal  
- School oversight
- Staff management
- Academic planning
- Performance monitoring

### Academic Coordinator
- Curriculum management
- Teacher assignments
- Academic scheduling
- Student-teacher mapping

### Teacher
- Class management
- Grade entry
- Assignment creation
- Student communication

### Student
- Course enrollment
- Grade viewing
- Assignment submission
- Chat participation

### Parent
- Child progress monitoring
- Teacher communication
- Fee payment
- Event notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Built with modern web technologies
- Designed for educational institutions
- Focused on user experience and scalability
