c# MERN Interview Project – User Management API

This is a Node.js project built with TypeScript, Express.js, MongoDB, and TypeORM.  
It provides a simple user management system with authentication, role-based access, and CRUD operations.

---

## **Features**

- User Registration (`/register`)
- User Login (`/login`) with JWT authentication
- List All Users (`/users`) – Admin only
- Get User by ID (`/users/:id`) – Admin can see any user; Staff can see only their own data
- Input validation using `class-validator`
- JWT authentication and role-based access control

---

## **Technologies Used**

- Node.js + TypeScript
- Express.js
- MongoDB
- TypeORM
- JWT Authentication
- class-validator

---

## **Setup Instructions**

### **1. Clone the repository**

git clone <your-repo-url>
cd <project-folder>
npm install

## **Setup environment variables**

PORT=4000
MONGO_URI=mongodb://localhost:27017/your-db-name //replace it with your db  
JWT_SECRET="your_secret_key"

##**start mongodb(if mongodb is not running)**

mongod
**Run the project**
npm run dev

### **API end points**

/auth/register - for registration

POST /register
Body: {
name: string,
email: string,
password: string,
role: "ADMIN" | "STAFF",
phone?: string,
city?: string,
country?: string
}

/auth/login - for login

POST /login
Body: {
email: string,
password: string
}
Response: { token: string } // use bearer token (if in postman)

/auth/users - for fetch all the users

GET /users
Header: Authorization: Bearer <JWT_TOKEN>

/auth/users/:id - for fetch user by id

GET /users/:id
Header: Authorization: Bearer <JWT_TOKEN>

/auth/users?search=name or email - for searching by name or email
GET user?search=name or email

/auth/users?country=countryName -for filter by country
GET user?country=countryName
