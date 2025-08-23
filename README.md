Here’s a polished and updated version of your README with your current environment, setup instructions, features, and some formatting improvements for clarity:

---

# Feedback Collection Platform

A **simplified Feedback Collection Platform** built with the MERN stack (MongoDB, Express.js, React.js, Node.js) where admins can create feedback forms and view responses, and customers can submit their feedback via public URLs.

---

## **Environment Variables**

### Backend (`backend/.env`)

```env
MONGO_URI="mongodb+srv://"
JWT_SECRET=""
PORT=5002
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5002
```

---

## **Overview**

The platform allows admins to create feedback forms with multiple-choice and text questions. Users can submit responses without authentication. Admins can view all responses in a dashboard and export them as CSV.

---

## **Setup Instructions**

### **Backend**

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and add your environment variables (`MONGO_URI` and `JWT_SECRET`).
4. Start the backend server:

```bash
npm start 
```
or start the server by nodemon

```bash
npm run dev
```

The backend runs on **port 5002**.

### **Frontend**

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and add `VITE_API_URL=http://localhost:5002`.
4. Start the frontend:

```bash
npm run dev
```

The frontend runs on **port 3000 or other free port**.

---

## **Features**

### **Admin**

* Register and login with JWT authentication.
* Create feedback forms with:

  * Multiple-choice questions (MCQs)
  * Open-ended text questions
* View all form responses in a dashboard.
* Export responses as **CSV**.
* Mobile-responsive UI.

### **Customer**

* Submit feedback via public URL without authentication.
* See confirmation message upon submission.

### **Technical Decisions**

* RESTful APIs for frontend-backend communication.
* JWT for secure admin authentication.
* Questions stored as an array inside the form document for flexibility.
* Responses stored separately, linked to forms via MongoDB ObjectId.
* Bonus: CSV export for responses.
* Basic responsive design for mobile devices.

---

## **Access**

* Admin dashboard: `http://localhost:anyPortNo`
* Public form submission: `http://localhost:anyPortNo/form/:formId`

---
 