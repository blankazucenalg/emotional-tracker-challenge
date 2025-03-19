# Emotional Tracker - Technical Test

This project is a technical test for evaluating candidates' coding skills. It's a mental wellbeing tracking application that allows users to record their emotions between therapy sessions.

## Project Structure

- `/frontend` - Next.js application with Styled Components
- `/backend` - Express.js server with MongoDB database
- Docker configuration for easy setup

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Installation

1. Clone the repository
2. Run Docker Compose:

```bash
docker compose up
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:5050
- MongoDB at localhost:27017

### Test Data (Seeding)

The application includes a system to generate test data, making it easier to test the functionalities.

#### Included Data:

- **Users**:
  - Email: `test@example.com` / Password: `password123` (role: user)
  - Email: `admin@example.com` / Password: `admin123` (role: admin)
  - Email: `maria@example.com` / Password: `maria123` (role: user with therapist)

- **Emotions**: Each user has 15 random emotion records from the last 30 days.

#### Options to run seeds:

1. **Manual** (from command line):
   ```bash
   cd backend
   npm run seed
   ```

2. **Automatic** (during Docker startup):
   - Edit the `docker-compose.yml` file
   - Change the `SEED_DATABASE` environment variable to `true`:
   ```yaml
   backend:
     # ...
     environment:
       - MONGO_URI=mongodb://mongodb:27017/emotionaltracker
       - JWT_SECRET=mysecretkey123
       - SEED_DATABASE=true  # Change to true to generate test data
       - EMAIL_ADDRESS
       - EMAIL_PASSWORD
   ```
   You can use a `.env` file to pass secrets like `EMAIL_ADDRESS` and `EMAIL_PASSWORD`
   - Restart containers: `docker compose down && docker compose up`

## Technical Test Tasks

As a candidate, you are expected to implement the following features:

1. **Backend Implementation for Emotion Tracking**
   - The UI for tracking emotions is already built
   - Implement the backend API to store and retrieve emotion entries
   - Add proper validation and authentication

2. **Wellness Reminder System**
   - Create a system to remind users about wellness activities
   - Implement both frontend and backend components

3. **Therapist Data Sharing** (Bonus)
   - Implement a feature to share emotional data with therapists
   - Consider privacy and security aspects

## API Documentation

### Authentication

- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login a user
- GET `/api/users/profile` - Get user profile (protected)
- PUT `/api/users/profile` - Update user's profile (protected)
- PUT `/api/users/updatePassword` - Update user's password (protected)

### Emotions

- GET `/api/emotions` - Get all emotions for a user (protected)
- GET `/api/emotions/:id` - Get a specific emotion
- POST `/api/emotions` - Create a new emotion entry (protected)
- PUT `/api/emotions/:id` - Update an emotion (protected)
- GET `/api/emotions/analytics/summary` - Get emotions summary (for dashboard analytics)

### Reminders

- GET `/api/reminders` - Get all reminders for a user (protected)
- POST `/api/reminders` - Create a new reminder entry (protected)
- DELETE `/api/reminders/:id` - Delete a reminder (protected)

## Technologies Used

- Frontend: Next.js, Styled Components, JavaScript
- Backend: Express.js, MongoDB, JWT authentication
- Infrastructure: Docker, Docker Compose