1️⃣ Download the project
simply download zip file or clone this project in your machine..

2️⃣in terminal go into backend directory and install dependencies.
cd backend
npm install

in terminal go into frontend directory and install dependencies.
cd ../frontend
npm install

3️⃣Set up environment variables
Copy your .env.example (or create a new .env) in backend folder.
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key

4️⃣ Run the servers
Backend:
npm run dev
Frontend:
cd frontend
npm start
