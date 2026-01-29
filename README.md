# online-quizzing-platform
Create customized quizzes and test your knowledge. 

## Features
```
•	Simple and easy-to-use personalized quiz platform.  
•	Create quizzes made up of multiple choice or true/false questions.
•	Reveal your score once you've completed your quiz.
•	Keep self-made quizzes in a library for future use.
```

## Project Structure
```
online-quizzing-platform/
│
├── backend/
|   ├── app/
|   │   ├── controller/
|   |   │   ├── quizController.js
|   |   │   ├── resultController.js
|   |   │   ├── userController.js
|   │   ├── middleware/
|   |   │   ├── auth.js
|   │   ├── model/
|   │   |   ├── Quiz.js
|   |   │   ├── Result.js
|   |   │   ├── User.js
|   ├── routes/
│   |   ├── api.js
│   ├── db.js
│   ├── server.js
├── public/
│   ├── account.html
│   ├── index.html
│   ├── login.html
│   ├── makequiz.html
│   ├── register.html
│   ├── style.css
│   ├── takequiz.html
├── .env
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```
## How to Run
### Requirements
```
•	Node.js (v18 or later recommended)
•	npm (comes with Node.js)
•	MongoDB Atlas (local installation will work too)
```
### Database
This project uses MongoDB Atlas, a cloud-hosted NoSQL database.

1. Create a MongoDB Atlas cluster.
2. Add your IP address to the Network Access list.
3. Create a database user.
4. Copy the connection string and it to a `.env` file:
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
```
### Setup
1. Clone repository
2. Change directory:
```
cd online-quizzing-platform
```
4. Install dependencies
```
npm install
```
3. Create a .env file in the root directory:
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_secret_key
```
4. Run the program:
```
node backend/server.js
```

## Future Improvements
1. Support additional media types for questions and answers (e.g., images, videos, audio clips).
2. Separate and distinctify personally-made quizzes and quizzes made by other users.
3. Store past scores and track progress.
4. Categorize quizzes (e.g., Easy/Medium/Hard, by topic, course, or question type) in order to improve discoverability.
5. Allow users to set a custom time limit for quiz completion.
