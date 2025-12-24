# Sweet Shop Management System

A modern, full-stack sweet shop management application built with TDD practices, featuring user authentication, inventory management, and a beautiful SaaS-inspired UI.

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with bcrypt
- **Testing:** Jest + Supertest
- **Validation:** express-validator

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand + React Query
- **Routing:** React Router v6
- **HTTP Client:** Axios

## 📋 Features

### User Features
- ✅ User registration and login with JWT authentication
- ✅ Browse all available sweets
- ✅ Search and filter sweets by name, category, or price range
- ✅ Purchase sweets (with inventory validation)
- ✅ Modern, responsive UI

### Admin Features
- ✅ Add new sweets to inventory
- ✅ Update sweet details (name, category, price, quantity)
- ✅ Delete sweets from inventory
- ✅ Restock inventory

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📁 Project Structure

```
sweet-shop-management/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── store/
│   └── package.json
└── README.md
```

## 🧪 Test Coverage

_Test coverage report will be added here_

## 🤖 My AI Usage

This project was developed with extensive use of AI tools to enhance productivity and code quality.

### AI Tools Used
- **GitHub Copilot:** Primary AI pair programmer
- **Claude (Anthropic):** Architecture planning and complex problem-solving
- **ChatGPT:** Documentation and test case generation

### How I Used AI

#### Planning & Architecture
- Used Claude to brainstorm the overall architecture and discuss trade-offs between different tech stack choices
- Consulted AI for MongoDB schema design best practices and indexing strategies
- Asked for recommendations on project structure and folder organization

#### Code Generation
- GitHub Copilot for generating boilerplate code (controllers, routes, model schemas)
- Used AI to generate initial TypeScript interfaces and types
- AI-assisted generation of test templates and common test patterns

#### Problem Solving
- Consulted AI when debugging authentication issues and JWT token validation
- Used AI to understand and implement proper error handling patterns
- Asked for help with complex MongoDB queries and aggregation pipelines

#### Testing
- AI-generated initial test suites for TDD workflow
- Used Copilot to quickly write test cases for edge cases
- Consulted AI for testing best practices with Jest and Supertest

#### UI Development
- Used AI to generate Tailwind CSS utility combinations for complex layouts
- Consulted for shadcn/ui component customization patterns
- AI-assisted responsive design implementations

### Reflection on AI Impact

**Positive Impact:**
- **Speed:** AI significantly accelerated boilerplate generation, allowing me to focus on business logic
- **Learning:** Discovered new patterns and best practices I wasn't aware of
- **Test Coverage:** AI helped me think of edge cases I might have missed
- **Documentation:** Faster generation of clear, comprehensive documentation

**Challenges:**
- **Verification Required:** Always had to review and test AI-generated code
- **Context Limitations:** Sometimes AI suggested outdated or incorrect approaches
- **Over-reliance Risk:** Had to ensure I understood every piece of code, not just copy-paste

**Key Takeaway:**
AI tools are powerful accelerators but require active engagement and critical thinking. I treated AI as a knowledgeable pair programmer rather than a replacement for understanding. Every AI-generated piece of code was reviewed, tested, and often refactored to meet project requirements.

## 📸 Screenshots

_Screenshots will be added here_

## 🌐 Live Demo

_Deployment link will be added here_

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets Endpoints (Protected)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets
- `POST /api/sweets` - Add new sweet (Admin only)
- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)

### Inventory Endpoints (Protected)
- `POST /api/sweets/:id/purchase` - Purchase a sweet
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only)

## 👤 Author

Hemant Singh

## 📄 License

This project is for educational purposes.
