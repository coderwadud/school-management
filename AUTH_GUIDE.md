# Authentication System - Usage Guide

## 🔐 Authentication Features

আপনার School Management System এ এখন সম্পূর্ণ authentication system যুক্ত হয়েছে।

- **School** create করার পর সেই email এবং password দিয়ে login করা যাবে
- **Teacher** create হওয়ার পর তাদের email এবং password দিয়ে login করা যাবে
- **Same login endpoint** (`/api/v1/auth/login`) দিয়ে both school ও teacher login করতে পারবে

## 📌 API Endpoints

### 1. School Registration (Public)

**POST** `/api/v1/schools`

```json
{
  "name": "ABC High School",
  "schoolCode": "ABC123",
  "email": "admin@abcschool.com",
  "password": "securepassword123",
  "phone": "01712345678",
  "address": {
    "country": "Bangladesh",
    "city": "Dhaka",
    "area": "Dhanmondi",
    "postalCode": "1205",
    "fullAddress": "House 12, Road 5, Dhanmondi"
  },
  "website": "https://abcschool.com",
  "logo": "https://example.com/logo.png"
}
```

**Response:**

```json
{
  "_id": "60d5ec49e8b4f123456789ab",
  "name": "ABC High School",
  "schoolCode": "ABC123",
  "email": "admin@abcschool.com",
  "phone": "01712345678",
  "address": {...},
  "website": "https://abcschool.com"
  // Note: password field removed from response for security
}
```

---

### 2. Login - School or Teacher (Public)

**POST** `/api/v1/auth/login`

> ⭐ **Same endpoint for both School and Teacher login!** System automatically detects the user type.

#### School Login Example:

```json
{
  "email": "admin@abcschool.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userType": "school",
  "user": {
    "id": "60d5ec49e8b4f123456789ab",
    "name": "ABC High School",
    "email": "admin@abcschool.com",
    "schoolCode": "ABC123"
  }
}
```

#### Teacher Login Example:

```json
{
  "email": "teacher@abcschool.com",
  "password": "teacherpass123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userType": "teacher",
  "user": {
    "id": "60d5ec49e8b4f123456789cd",
    "name": "John Doe",
    "email": "teacher@abcschool.com",
    "phone": "01712345678",
    "designation": "Senior Teacher",
    "school": {
      "_id": "60d5ec49e8b4f123456789ab",
      "name": "ABC High School"
    },
    "branch": {
      "_id": "60d5ec49e8b4f123456789ef",
      "name": "Main Branch"
    }
  }
}
```

**Token Expiry:** 7 days

---

### 3. Get Current User Info (Protected)

**GET** `/api/v1/auth/me`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Response (School):**

```json
{
  "message": "User retrieved successfully",
  "userType": "school",
  "user": {
    "_id": "60d5ec49e8b4f123456789ab",
    "name": "ABC High School",
    "email": "admin@abcschool.com",
    "schoolCode": "ABC123",
    ...
  }
}
```

**Response (Teacher):**

```json
{
  "message": "User retrieved successfully",
  "userType": "teacher",
  "user": {
    "_id": "60d5ec49e8b4f123456789cd",
    "name": "John Doe",
    "email": "teacher@abcschool.com",
    "designation": "Senior Teacher",
    "schoolId": {...},
    "branchId": {...},
    ...
  }
}
```

---

### 4. Change Password (Protected)

**POST** `/api/v1/auth/change-password`

> Works for both School and Teacher based on the token

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Body:**

```json
{
  "oldPassword": "securepassword123",
  "newPassword": "newsecurepassword456"
}
```

**Response:**

```json
{
  "message": "Password changed successfully"
}
```

---

## 🔒 Protected Routes

নিচের routes গুলো এখন **authentication required** (JWT token প্রয়োজন):

### Academic Routes:

- **POST** `/api/v1/branches` - Create branch
- **PUT** `/api/v1/branches/:id` - Update branch
- **DELETE** `/api/v1/branches/:id` - Delete branch
- **PATCH** `/api/v1/branches/:id/status` - Toggle branch status

- **POST** `/api/v1/classes` - Create class
- **PUT** `/api/v1/classes/:id` - Update class
- **DELETE** `/api/v1/classes/:id` - Delete class
- **PATCH** `/api/v1/classes/:id/status` - Toggle class status

- **POST** `/api/v1/sessions` - Create session
- **PUT** `/api/v1/sessions/:id` - Update session
- **DELETE** `/api/v1/sessions/:id` - Delete session
- **PATCH** `/api/v1/sessions/:id/status` - Toggle session status

- **POST** `/api/v1/shifts` - Create shift
- **PUT** `/api/v1/shifts/:id` - Update shift
- **DELETE** `/api/v1/shifts/:id` - Delete shift
- **PATCH** `/api/v1/shifts/:id/status` - Toggle shift status

- **POST** `/api/v1/mediums` - Create medium
- **PUT** `/api/v1/mediums/:id` - Update medium
- **DELETE** `/api/v1/mediums/:id` - Delete medium
- **PATCH** `/api/v1/mediums/:id/status` - Toggle medium status

- **POST** `/api/v1/groups` - Create group
- **PUT** `/api/v1/groups/:id` - Update group
- **DELETE** `/api/v1/groups/:id` - Delete group
- **PATCH** `/api/v1/groups/:id/status` - Toggle group status

- **POST** `/api/v1/sections` - Create section
- **PUT** `/api/v1/sections/:id` - Update section
- **DELETE** `/api/v1/sections/:id` - Delete section
- **PATCH** `/api/v1/sections/:id/status` - Toggle section status

### Teacher Routes:

- **POST** `/api/v1/teachers` - Create teacher
- **PUT** `/api/v1/teachers/:id` - Update teacher
- **DELETE** `/api/v1/teachers/:id` - Delete teacher
- **PATCH** `/api/v1/teachers/:id/status` - Toggle teacher status

### School Routes:

- **PUT** `/api/v1/schools/:id` - Update school
- **DELETE** `/api/v1/schools/:id` - Delete school

---

## 🌐 Public Routes (No Authentication Required)

নিচের routes গুলো public - কোনো token ছাড়াই access করা যাবে:

- **GET** `/api/v1/schools` - Get all schools
- **GET** `/api/v1/schools/:id` - Get school by ID
- **GET** `/api/v1/schools/options` - Get schools dropdown options
- **POST** `/api/v1/schools` - Create school (Registration)

- **GET** `/api/v1/branches` - Get all branches
- **GET** `/api/v1/branches/:id` - Get branch by ID
- **GET** `/api/v1/branches/options` - Get branches dropdown options

- **GET** `/api/v1/classes` - Get all classes
- **GET** `/api/v1/classes/:id` - Get class by ID
- **GET** `/api/v1/classes/options` - Get classes dropdown options

- **GET** `/api/v1/teachers` - Get all teachers
- **GET** `/api/v1/teachers/:id` - Get teacher by ID
- **GET** `/api/v1/teachers/options` - Get teachers dropdown options

_(Similar GET endpoints for sessions, shifts, mediums, groups, sections)_

---

## 🧪 Testing with Postman/Thunder Client

### Scenario 1: School Registration and Login

#### Step 1: Register a School

```
POST http://localhost:5000/api/v1/schools
Content-Type: application/json

{
  "name": "Test School",
  "schoolCode": "TEST001",
  "email": "test@school.com",
  "password": "password123",
  "phone": "01712345678"
}
```

#### Step 2: School Login

```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@school.com",
  "password": "password123"
}
```

**Copy the `token` from response (userType will be "school")**

#### Step 3: Use Protected Routes

```
POST http://localhost:5000/api/v1/branches
Content-Type: application/json
Authorization: Bearer <paste_your_token_here>

{
  "name": "Main Branch",
  "branchCode": "MAIN001",
  "schoolId": "<your_school_id>",
  "principalName": "Mr. Principal"
}
```

---

### Scenario 2: Teacher Creation and Login

#### Step 1: Create a Teacher (School must be logged in)

```
POST http://localhost:5000/api/v1/teachers
Content-Type: application/json
Authorization: Bearer <school_token>

{
  "name": "John Doe",
  "schoolId": "<school_id>",
  "branchId": "<branch_id>",
  "email": "john.teacher@school.com",
  "password": "teacher123",
  "phone": "01712345679",
  "nid": "1234567890123",
  "designation": "Senior Teacher",
  "educationQualification": "M.Sc in Mathematics",
  "salary": 30000,
  "gender": "Male",
  "dateOfBirth": "1990-05-15",
  "joiningDate": "2020-01-10"
}
```

#### Step 2: Teacher Login (Same endpoint!)

```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "john.teacher@school.com",
  "password": "teacher123"
}
```

**Response will have `userType: "teacher"` with school and branch info**

#### Step 3: Teacher Access Protected Routes

```
GET http://localhost:5000/api/v1/auth/me
Authorization: Bearer <teacher_token>
```

**Teacher will receive their own info with school and branch populated**

---

## ⚠️ Error Responses

### 401 Unauthorized (No Token)

```json
{
  "message": "No token, authorization denied"
}
```

### 401 Unauthorized (Invalid Token)

```json
{
  "message": "Token is not valid"
}
```

### 401 Unauthorized (Expired Token)

```json
{
  "message": "Token has expired"
}
```

### 401 Unauthorized (Wrong Credentials)

```json
{
  "message": "Invalid email or password"
}
```

### 403 Forbidden (Inactive Teacher Account)

```json
{
  "message": "Your account is inactive. Please contact administrator."
}
```

### 400 Bad Request (Missing Fields)

```json
{
  "message": "Please provide email and password"
}
```

---

## 🎯 Key Features

### 1. **Unified Login Endpoint**

- Single `/api/v1/auth/login` endpoint for both School and Teacher
- System automatically detects user type based on email
- Returns appropriate user info and userType in response

### 2. **Teacher Status Check**

- Teachers with `status: false` cannot login
- Active status check happens both at login and token verification
- Error message guides inactive teachers to contact administrator

### 3. **Token Information**

- School token includes: `userId`, `email`, `userType: "school"`
- Teacher token includes: `userId`, `email`, `userType: "teacher"`, `schoolId`, `branchId`
- Both tokens expire after 7 days

### 4. **Backward Compatibility**

- `req.schoolId` still available in middleware (for school users)
- `req.school` still available for school authentication
- `req.teacher` available for teacher authentication
- `req.user` contains current user (school or teacher)

---

## 🔧 Password Requirements

- Minimum 6 characters
- Required for both school and teacher registration
- Automatically hashed using bcrypt (10 salt rounds)
- Never returned in API responses

---

## 📝 Important Notes

1. **Token Storage:** Store the JWT token in localStorage/sessionStorage in your frontend
2. **Token Header:** Always send token as `Authorization: Bearer <token>`
3. **Token Expiry:** Tokens expire after 7 days - implement refresh token logic if needed
4. **Password Security:** Passwords are hashed with bcrypt before storing
5. **Protected vs Public:** GET requests are public, Create/Update/Delete require authentication
6. **User Type Detection:** Check `userType` in login response to determine if user is school or teacher
7. **Teacher Status:** Only active teachers (status: true) can login and access protected routes

---

## 🚀 Quick Start

1. Start your server:

```bash
npm start
```

2. Server runs on: `http://localhost:5000`

3. Test the authentication:
   - **School:** Register → Login → Use token for protected routes
   - **Teacher:** School creates teacher → Teacher logs in with their credentials → Access protected routes

---

**Happy Coding! 🎉**
