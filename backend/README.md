# Geography Quiz Game Backend

This is a Flask-based geography quiz game backend service, providing functions such as user registration, question retrieval, answer submission, and progress tracking.

## Environment Requirements
- Python 3.10+
- SQLite3

## Installation Steps
In current directory (backend), follow these steps to install and run the service:

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

3. Initialize database:
```bash
mkdir -p db # if first time running
python init_db.py
```

4. Start service:
```bash
flask run --port=5001 # if not work, try to source venv/bin/activate double times
```

The service will run at http://localhost:5001.

## Reset Database
If you need to reset the database (e.g., to clear all test data), follow these steps:

1. Stop the currently running Flask service
2. Delete the database file
3. Reinitialize the database
4. Restart the Flask service

Specific commands are as follows:
```bash
# 1. Stop Flask service
pkill -f "flask run"

# 2. Delete database file
rm -f db/geo_app.db

# 3. Reinitialize database
python init_db.py

# 4. Restart Flask service
flask run --port=5001
```

Note: Resetting the database will delete all user data, so proceed with caution.

## API Test Cases

### 1. User Registration
```bash
curl -X POST http://localhost:5001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "nationality": "Ireland",
    "password": "test123"
  }'
```

Expected response:
```json
{
  "message": "Registration successful",
  "user": {
    "user_id": 1,
    "email": "test@example.com",
    "nationality": "Ireland",
    "current_location": null,
    "score": 0
  }
}
```

### 2. User Login
```bash
curl -X POST http://localhost:5001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

Expected response:
```json
{
  "message": "Login successful",
  "user": {
    "user_id": 1,
    "email": "test@example.com",
    "nationality": "Ireland",
    "current_location": null,
    "score": 0
  }
}
```

### 3. Get Question
```bash
curl "http://localhost:5001/api/quiz?user_id=1"
```

Expected response:
```json
{
  "question_id": "Ireland_Capital",
  "question": "What is the capital of Mauritania?",
  "options": ["Nouakchott", "Bamako", "Dakar", "Algiers"],
  "country_iso": "Ireland",
  "question_type": "Capital"
}
```

### 4. Submit Answer
```bash
curl -X POST http://localhost:5001/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "question_id": "Ireland_Capital",
    "answer": "Nouakchott"
  }'
```

Expected response:
```json
{
  "correct": false,
  "correct_answer": "Dublin",
  "explanation": "The capital of Ireland is Dublin."
}
```

### 5. Get Progress
```bash
curl "http://localhost:5001/api/progress?user_id=1"
```

Expected response:
```json
{
  "user": {
    "user_id": 1,
    "email": "test@example.com",
    "nationality": "Ireland",
    "current_location": null,
    "score": 10
  },
  "progress": {
    "total_countries": 232,
    "unlocked_countries": 0,
    "progress_percentage": 0.0
  },
  "unlocked_countries": [],
  "all_countries": [...]
}
```

## Feature Description

1. User System
   - Supports user registration (requires email, nationality, and password)
   - Supports user login (requires email and password)
   - Records user nationality and current location
   - Tracks user score

2. Question System
   - Generates questions based on user nationality
   - Supports multiple question types (capital, currency, national sport)
   - Provides single-choice questions with 4 options

3. Progress System
   - Displays unlocked countries
   - Calculates overall progress percentage
   - Provides complete country database information

4. Unlock Mechanism
   - Users start from their current location
   - Unlock neighboring countries of the current location
   - Earn points by answering questions

## Notes

1. Development Environment Setup
   - Ensure the service is run in the correct directory (backend directory)
   - Use a virtual environment to manage dependencies
   - Database initialization only needs to be performed once

2. API Usage
   - All requests must include user_id
   - Submitting answers requires providing the complete question_id
   - Progress queries will return complete country database information
   - User registration must include the password field

3. Error Handling
   - The service will return appropriate HTTP status codes
   - Error responses include detailed error information
   - Detailed error traces will be displayed in development mode