# RentEasy - Smart Rentals for Modern Living

A comprehensive peer-to-peer rental marketplace platform that connects item owners with renters. Built with modern web technologies, RentEasy provides a secure, user-friendly platform for renting everything from tools and electronics to vehicles and spaces.

![RentEasy Banner](https://img.shields.io/badge/RentEasy-Smart%20Rentals-purple?style=for-the-badge&logo=react)

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure JWT-based authentication system
- **Item Management** - Create, edit, and manage rental listings with categories
- **Rental System** - Complete rental workflow from request to completion
- **Real-time Chat** - Socket.io powered messaging between renters and owners
- **Payment Processing** - Integrated payment system for secure transactions
- **Review System** - Rate and review items and users
- **User Profiles** - Comprehensive user profiles with rental history and statistics

### User Experience
- **Modern UI/UX** - Beautiful, responsive design with Framer Motion animations
- **Real-time Updates** - Live chat and status updates
- **Category-based Browsing** - Organized item categories with emoji indicators
- **Search & Filter** - Find items by category, location, and availability
- **Mobile Responsive** - Optimized for all device sizes

### Security & Trust
- **Verified Users** - User verification system
- **Secure Payments** - Protected transaction processing
- **Smart Insurance** - Coverage for peace of mind
- **24/7 Support** - Round-the-clock customer support

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **CORS** - Cross-origin resource sharing

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **NextAuth.js** - Authentication provider
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **React Icons** - Icon library

### Development Tools
- **Prisma Studio** - Database management
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **ts-node-dev** - Development server

## 📁 Project Structure

```
RentalSystem/
├── server/                 # Backend API server
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── config/         # Configuration files
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── prisma/             # Database schema and migrations
│   └── package.json        # Backend dependencies
├── web/                    # Frontend Next.js application
│   ├── app/                # Next.js App Router
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── providers/      # NextAuth provider
│   │   ├── utils/          # Utility functions
│   │   └── [pages]/        # Application pages
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users** - User accounts with authentication and profile information
- **Items** - Rental listings with categories, pricing, and availability
- **Rentals** - Rental transactions with status tracking
- **Payments** - Payment records for rentals
- **Reviews** - User reviews and ratings
- **Categories** - Item categorization system
- **Chats** - Real-time messaging between users
- **Messages** - Individual chat messages

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RentalSystem
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the `server` directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/rentaleasy"
   JWT_SECRET="your-jwt-secret-key"
   PORT=3001
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Set up the frontend**
   ```bash
   cd ../web
   npm install
   ```

6. **Configure frontend environment**
   Create a `.env.local` file in the `web` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL=http://localhost:3000
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The API server will run on `http://localhost:3001`

2. **Start the frontend application**
   ```bash
   cd web
   npm run dev
   ```
   The web application will run on `http://localhost:3000`

3. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/users/create` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/get` - Get current user (protected)
- `PUT /api/users/update` - Update user details (protected)
- `POST /api/users/updatepassword` - Change password (protected)

### Items
- `GET /api/items` - Get all items (protected)
- `POST /api/items/create` - Create new item (protected)
- `GET /api/items/:id` - Get item by ID (protected)
- `PUT /api/items/update/:id` - Update item (protected)
- `DELETE /api/items/delete/:id` - Delete item (protected)
- `GET /api/items/category/:categoryName` - Get items by category (protected)
- `GET /api/items/getitembyowner` - Get user's items (protected)

### Rentals
- `GET /api/rentals` - Get user's rentals (protected)
- `POST /api/rentals/create` - Create rental request (protected)
- `PUT /api/rentals/:id/status` - Update rental status (protected)

### Chat
- `GET /api/chat` - Get user's chats (protected)
- `POST /api/chat/create` - Create new chat (protected)
- `GET /api/chat/:id/messages` - Get chat messages (protected)

## 🎨 Key Features in Detail

### Real-time Chat System
- Socket.io powered real-time messaging
- Chat rooms for each rental transaction
- Message persistence in database
- User authentication for chat access

### User Profile Management
- Comprehensive user profiles with statistics
- Rental history tracking
- Review and rating system
- Profile customization options

### Item Management
- Category-based organization
- Image upload support
- Location-based filtering
- Availability status tracking

### Rental Workflow
- Request → Approval → Payment → Completion
- Status tracking throughout the process
- Payment integration
- Review system post-rental

## 🔧 Development

### Available Scripts

**Backend (server/)**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
```

**Frontend (web/)**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

## 🚀 Deployment

### Backend Deployment
1. Set up a PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build and deploy the Node.js application

### Frontend Deployment
1. Configure environment variables
2. Build the Next.js application
3. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Advanced search and filtering
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with external payment gateways
- [ ] Push notifications
- [ ] Video chat integration

---

**Built with ❤️ using modern web technologies**
