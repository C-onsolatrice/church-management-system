# Rwanda Church Management System

A comprehensive church management system designed for churches across Rwanda, featuring multi-branch support, member management, attendance tracking, financial reporting, and administrative tools.

## Features

- **Multi-Branch Church Management**: Manage multiple church branches from a single dashboard
- **Member Management**: Track member information, roles, and assignments
- **Attendance Tracking**: Monitor service attendance and member participation
- **Event Management**: Schedule and manage church events and activities
- **Financial Reporting**: Track tithes, offerings, and expenses with detailed reports
- **Asset Management**: Manage church assets and maintenance logs
- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Export Functionality**: Generate PDF and Excel reports for regulatory compliance

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with Passport
- **API Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Validation Pipes

### Frontend
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd church-management-system
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret_key_here"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_key_here"
ALLOWED_ORIGINS="http://localhost:3000"
PORT=4000
```

Generate Prisma client and create database:

```bash
npx prisma generate
npx prisma db push
```

Start the backend server:

```bash
npm run start:dev
```

The backend API will be available at `http://localhost:4000`
API documentation available at `http://localhost:4000/api/docs`

### 3. Frontend Setup

Navigate to the frontend directory (in a new terminal):

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Set up environment variables:

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

### 1. Register Your Church

1. Navigate to `http://localhost:3000/register`
2. Fill in the church information (name, legal registration number, address)
3. Create the administrator account
4. Submit the registration form
5. Check your email for verification (simulated in logs)

### 2. Login

1. Navigate to `http://localhost:3000/login`
2. Enter your administrator credentials
3. Click "Sign In"

### 3. Dashboard

After logging in, you'll have access to:
- **Overview**: Key metrics (members, visitors, tithes, expenses)
- **Members**: Manage church members
- **Attendance**: Track service attendance
- **Events**: Manage church events
- **Finance**: Financial overview and reports
- **Reports**: Generate and export reports

## User Roles

- **SUPER_ADMIN**: Full system access, can manage churches and branches
- **ADMIN**: Branch-level management
- **PASTOR**: Member management and spiritual oversight
- **TREASURER**: Financial management
- **MEMBER**: Basic access to personal information

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new church
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `POST /auth/verify-email` - Verify email address
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### Users
- `GET /users` - List users (with pagination)
- `GET /users/:id` - Get user details
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Soft delete user
- `POST /users/:id/restore` - Restore deleted user

### Events
- `GET /events` - List events
- `POST /events` - Create event
- `PATCH /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Attendance
- `GET /attendance` - List attendance records
- `POST /attendance` - Record attendance
- `PATCH /attendance/:id` - Update attendance

### Assets
- `GET /assets` - List assets
- `POST /assets` - Create asset
- `PATCH /assets/:id` - Update asset
- `DELETE /assets/:id` - Delete asset

### Reports
- `GET /reports/dashboard` - Dashboard statistics
- `GET /reports/export/:format` - Export reports (PDF/Excel)

## Database Schema

The system uses the following main entities:

- **Church**: Church organization details
- **Branch**: Multiple branches per church
- **User**: System users with roles
- **Event**: Church events and activities
- **Attendance**: Member attendance records
- **Asset**: Church assets and equipment
- **MaintenanceLog**: Asset maintenance records

## Troubleshooting

### PowerShell Script Execution Error

If you encounter a PowerShell script execution error when running `npm install`, you need to change the execution policy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use the following command to bypass the policy for the current session:

```powershell
npm install --using=bash
```

### Prisma Client Not Found

If you see errors about `@prisma/client` not being found:

```bash
cd backend
npx prisma generate
```

### Database Connection Issues

Ensure your `.env` file has the correct `DATABASE_URL`. For SQLite, use:

```env
DATABASE_URL="file:./dev.db"
```

Then run:

```bash
npx prisma db push
```

### CORS Errors

If you encounter CORS errors between frontend and backend, ensure the `ALLOWED_ORIGINS` in your backend `.env` includes your frontend URL:

```env
ALLOWED_ORIGINS="http://localhost:3000"
```

## Development

### Backend Development

```bash
cd backend
npm run start:dev  # Watch mode with hot reload
npm run start:debug  # Debug mode
npm run lint  # Run ESLint
npm run test  # Run tests
```

### Frontend Development

```bash
cd frontend
npm run dev  # Development server
npm run build  # Production build
npm run start  # Start production server
npm run lint  # Run ESLint
```

## Production Deployment

### Backend

1. Set production environment variables
2. Build the application:

```bash
cd backend
npm run build
npm run start:prod
```

3. Use a production database (PostgreSQL recommended)
4. Set up proper SSL/TLS certificates
5. Configure reverse proxy (nginx/Apache)

### Frontend

1. Build the application:

```bash
cd frontend
npm run build
```

2. Deploy the `.next` folder to your hosting provider
3. Set `NEXT_PUBLIC_API_URL` to your production backend URL

## Security Considerations

- Change default JWT secrets in production
- Use strong, unique passwords
- Enable HTTPS in production
- Implement rate limiting
- Regular security audits
- Keep dependencies updated
- Use environment variables for sensitive data

## License

This project is licensed under the UNLICENSED license.

## Support

For issues and questions, please contact the development team or create an issue in the repository.

## Acknowledgments

- Built for churches across Rwanda
- Designed to support multi-branch church management
- Focused on regulatory compliance and financial transparency
