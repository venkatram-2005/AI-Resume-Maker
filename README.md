# 🧠 AI Resume Builder

AI Resume Builder is a sophisticated web application that leverages **Artificial Intelligence** to help users craft professional, polished resumes with ease.  
It combines an intuitive user interface, smart resume generation features, and a secure backend for managing user data efficiently.

---

## 🚀 Features

- 🧾 AI-powered resume generation  
- 🎨 Clean and modern UI built with TailwindCSS  
- 🧩 State management using Redux Toolkit  
- 🔐 Secure authentication and data handling   
- ⚙️ RESTful API with Node.js and Express  
- 💾 MongoDB for fast and scalable data storage  

---

## 🛠️ Tech Stack

**Frontend:**  
- React.js  
- TailwindCSS  
- Redux Toolkit  

**Backend:**  
- Node.js  
- Express.js  
 

**Database:**  
- MongoDB  


## ⚙️ Installation and Setup

Follow these steps to run the project locally:

### 1. Clone the repository
git clone https://github.com/venkatram-2005/AI-Resume-Maker.git
cd AI-Resume-Maker

### 2. Install dependencies
Frontend
cd client
npm install

### Backend
cd ../server
npm install

### 3. Environment variables

Create a .env file in both the client and server directories with the required keys.
Example .env for backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key

### 4. Run the application
Start backend
cd server
npm run dev

Start frontend
cd ../client
npm start

### Features
1. 🔒 Secure User Authentication
Custom authentication with bcrypt password hashing
JWT-based session management

<img width="1600" height="743" alt="image" src="https://github.com/user-attachments/assets/e77ca613-3ec7-476b-8217-8f9f75a23176" />
<img width="1600" height="778" alt="image" src="https://github.com/user-attachments/assets/6873d414-77eb-44ea-b94d-e123c3a68cd5" />


### 2. 🏠 User Dashboard
View and manage previous resume versions
<img width="1600" height="744" alt="image" src="https://github.com/user-attachments/assets/4a8b1363-f8d2-4435-a24c-273a47073128" />


### 3.🎨 Customizable Templates and 🤖 AI-Powered Suggestions
- Choose from multiple resume templates
- Smart resume content suggestions

<img width="1583" height="738" alt="image" src="https://github.com/user-attachments/assets/238fb601-245f-4d37-bfdf-e599136e0b34" />

### 4.📄 Export Options
Download resumes in PDF format
<img width="1600" height="749" alt="image" src="https://github.com/user-attachments/assets/ba9cb40a-3386-46a0-9eb5-2b9ee68a04fb" />



