# Gamified Geography Learning Web Application

A Web application that helps users learn geography through gamified quizzes and map visualization.

## Project Overview

This project is an educational geography learning platform that helps users learn about countries around the world through gamification. Users can earn points by answering questions about countries, unlock new countries, and view their learning progress on an interactive map.

### Main Features

- User registration and login system
- Personalized geography knowledge quizzes
- Gamified learning mechanism (points, country unlocking)
- Interactive map visualization
- Learning progress tracking

## Technology Stack

- Backend: Python + Flask
- Database: SQLite
- Frontend: React + TypeScript (planned)
- Map: Leaflet.js (planned)

## Project Structure

```
geo-learning-app/
├── backend/
│   ├── app.py              # Flask main application
│   ├── models/             # Data models
│   │   ├── country.py      # Country model
│   │   └── user.py         # User model
│   ├── services/           # Business logic
│   │   ├── quiz.py         # Quiz service
│   │   └── progress.py     # Progress service
│   ├── db/                 # Database
│   │   └── geo_app.db      # SQLite database
│   ├── data/               # Data files
│   │   └── countries.json  # Country data
│   └── init_db.py          # Database initialization script
├── frontend/               # Frontend code (planned)
├── venv/                   # Python virtual environment
└── README.md              # Project documentation
```

## Installation Instructions

1. Clone the project
```bash
git clone [url]
cd [dir]
```

2. Follow the instruction Readme.md in each service

The backend application will run at http://localhost:5001

## API Documentation

### User Related
- POST /api/register - User registration
- POST /api/login - User login

### Quiz Related
- GET /api/quiz - Get quiz questions
- POST /api/submit - Submit answers

### Progress Related
- GET /api/progress - Get learning progress
- GET /api/countries - Get country list

## Development Status

- [ ] Project initialization
- [ ] Backend infrastructure
- [ ] Database implementation
- [ ] API implementation
- [ ] Frontend development
- [ ] Map integration

## License

MIT License
