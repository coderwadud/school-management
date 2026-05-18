# Quick API Usage Guide - Frontend Integration

## 🚀 Getting Started

### 1. Base Configuration

```javascript
// api/config.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 📝 Common Usage Examples

### Authentication

```javascript
// Login
const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", response.data.token);
  return response.data;
};

// Get Profile
const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};
```

### Students

```javascript
// Get all students with filters
const getStudents = async (filters) => {
  const response = await api.get("/students", { params: filters });
  // filters can include: page, limit, search, classId, sectionId, status
  return response.data;
};

// Create student with photo
const createStudent = async (studentData, photo) => {
  const formData = new FormData();
  Object.keys(studentData).forEach((key) => {
    formData.append(key, studentData[key]);
  });
  if (photo) {
    formData.append("image", photo);
  }

  const response = await api.post("/students", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
```

### Attendance

```javascript
// Mark student attendance
const markAttendance = async (attendanceData) => {
  const response = await api.post("/attendance/students", {
    classId: attendanceData.classId,
    sectionId: attendanceData.sectionId,
    date: attendanceData.date,
    students: attendanceData.students, // Array of {studentId, status, remarks}
  });
  return response.data;
};

// Get student attendance history
const getStudentAttendance = async (studentId, startDate, endDate) => {
  const response = await api.get(`/attendance/students/student/${studentId}`, {
    params: { startDate, endDate },
  });
  return response.data;
};
```

### Examination

```javascript
// Get exam results
const getExamResults = async (examId, classId) => {
  const response = await api.get(`/exam-results/exam/${examId}`, {
    params: { classId },
  });
  return response.data;
};

// Generate report card
const generateReportCard = async (studentId, examId) => {
  const response = await api.post("/report-cards", {
    studentId,
    examId,
  });
  return response.data;
};
```

### Fee Collection

```javascript
// Collect fee
const collectFee = async (paymentData) => {
  const response = await api.post("/fee-collections", {
    studentId: paymentData.studentId,
    feeTypeId: paymentData.feeTypeId,
    amount: paymentData.amount,
    paymentMethod: paymentData.paymentMethod,
    transactionId: paymentData.transactionId,
    remarks: paymentData.remarks,
  });
  return response.data;
};

// Get pending fees
const getPendingFees = async () => {
  const response = await api.get("/fee-collections/pending");
  return response.data;
};
```

### Online Classes (NEW)

```javascript
// Create online class
const createOnlineClass = async (classData) => {
  const response = await api.post("/online-classes", {
    title: classData.title,
    classId: classData.classId,
    subjectId: classData.subjectId,
    teacherId: classData.teacherId,
    classType: classData.classType, // "Live" or "Recorded"
    platform: classData.platform, // "Zoom", "Google Meet", etc.
    meetingLink: classData.meetingLink,
    scheduledDate: classData.scheduledDate,
    startTime: classData.startTime,
    endTime: classData.endTime,
  });
  return response.data;
};

// Get upcoming classes
const getUpcomingClasses = async (teacherId) => {
  const response = await api.get("/online-classes/upcoming", {
    params: { teacherId },
  });
  return response.data;
};
```

### Communication (SMS/Email)

```javascript
// Send SMS
const sendSMS = async (smsData) => {
  const response = await api.post("/sms/send", {
    recipientType: smsData.recipientType, // "Student", "Teacher", "Staff", "All"
    recipientIds: smsData.recipientIds, // Array of IDs
    message: smsData.message,
    smsType: smsData.smsType, // "General", "Notice", "Fee Reminder", etc.
  });
  return response.data;
};

// Send Email
const sendEmail = async (emailData) => {
  const response = await api.post("/emails/send", {
    recipientType: emailData.recipientType,
    recipientIds: emailData.recipientIds,
    subject: emailData.subject,
    body: emailData.body,
    emailType: emailData.emailType,
  });
  return response.data;
};
```

### System Settings (NEW)

```javascript
// Get settings
const getSettings = async () => {
  const response = await api.get("/settings");
  return response.data;
};

// Update school info
const updateSchoolInfo = async (schoolInfo) => {
  const response = await api.put("/settings/school-info", schoolInfo);
  return response.data;
};

// Update appearance
const updateAppearance = async (appearance) => {
  const response = await api.put("/settings/appearance", {
    themeName: appearance.themeName,
    primaryColor: appearance.primaryColor,
    secondaryColor: appearance.secondaryColor,
  });
  return response.data;
};
```

### Admin Users & Roles (NEW)

```javascript
// Create admin user
const createAdminUser = async (userData) => {
  const response = await api.post("/admin-users", {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
    role: userData.roleId,
  });
  return response.data;
};

// Create role with permissions
const createRole = async (roleData) => {
  const response = await api.post("/roles", {
    name: roleData.name,
    displayName: roleData.displayName,
    permissions: roleData.permissions,
    // permissions format: [{ module: "students", actions: ["create", "read", "update"] }]
  });
  return response.data;
};
```

---

## 🎯 Common Filter Patterns

### Pagination

```javascript
{
  page: 1,
  limit: 10
}
```

### Search

```javascript
{
  search: "John"; // Searches in name, email, roll number, etc.
}
```

### Date Range

```javascript
{
  startDate: "2024-01-01",
  endDate: "2024-12-31"
}
```

### Status Filter

```javascript
{
  status: true; // or false
}
```

### Multiple Filters

```javascript
{
  page: 1,
  limit: 20,
  search: "John",
  classId: "65abc123...",
  sectionId: "65def456...",
  status: true
}
```

---

## 📤 File Upload Examples

### Single File Upload

```javascript
const uploadFile = async (file, endpoint) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
```

### Multiple Files Upload

```javascript
const uploadMultipleFiles = async (files, endpoint) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await api.post(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
```

---

## 🔄 Response Format

### Success Response

```javascript
{
  success: true,
  message: "Operation successful",
  data: { /* response data */ },
  pagination: { // For list endpoints
    total: 100,
    page: 1,
    limit: 10,
    pages: 10
  }
}
```

### Error Response

```javascript
{
  success: false,
  message: "Error message here"
}
```

---

## ⚡ Service Layer Example (Recommended)

```javascript
// services/studentService.js
import api from "./config";

export const studentService = {
  getAll: (filters) => api.get("/students", { params: filters }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data, photo) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    if (photo) formData.append("image", photo);
    return api.post("/students", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  toggleStatus: (id) => api.patch(`/students/${id}/status`),
};
```

Usage in component:

```javascript
import { studentService } from "./services/studentService";

// In your React/Vue component
const loadStudents = async () => {
  try {
    const response = await studentService.getAll({
      page: 1,
      limit: 10,
      classId: selectedClass,
    });
    setStudents(response.data.data);
  } catch (error) {
    console.error("Error loading students:", error);
  }
};
```

---

## 🎨 React Component Example

```jsx
import React, { useState, useEffect } from "react";
import api from "../api/config";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    classId: "",
  });

  useEffect(() => {
    loadStudents();
  }, [filters]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/students", { params: filters });
      setStudents(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/students/${id}`);
        loadStudents(); // Reload list
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div>
      <h1>Students</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>
                  {student.firstName} {student.lastName}
                </td>
                <td>{student.rollNumber}</td>
                <td>{student.classId?.className}</td>
                <td>
                  <button onClick={() => handleDelete(student._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentList;
```

---

## 🔑 Key Points to Remember

1. **Always use Bearer token** for authenticated requests
2. **Use FormData** for file uploads
3. **Handle errors properly** with try-catch
4. **Use filters** for pagination and search
5. **Check response.data.success** before using data
6. **Store token in localStorage** after login
7. **Clear token on logout**
8. **Use service layer** for better code organization

---

## 🎉 All Features Available!

✅ 311 API Endpoints
✅ Complete CRUD Operations
✅ File Upload Support
✅ Pagination & Search
✅ Status Management
✅ Authentication & Authorization
✅ SMS & Email Integration
✅ Online Classes
✅ System Settings
✅ Role-based Access Control

**তোমার frontend development শুরু করতে পারো! 🚀**
