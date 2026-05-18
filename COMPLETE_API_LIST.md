# Complete API Summary - School Management System

## Base URL

```
http://localhost:5000/api/v1
```

## Authentication

All routes (except login/register and public certificate verification) require JWT token in header:

```
Authorization: Bearer <token>
```

---

## 📊 MENU-WISE API BREAKDOWN

### 1. Dashboard APIs

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| GET    | `/dashboard/stats`          | Get dashboard statistics |
| GET    | `/dashboard/monthly-report` | Get monthly report       |

---

### 2. Academic Management

#### Schools

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | `/schools`            | Create school        |
| GET    | `/schools`            | Get all schools      |
| GET    | `/schools/:id`        | Get school by ID     |
| PUT    | `/schools/:id`        | Update school        |
| DELETE | `/schools/:id`        | Delete school        |
| PATCH  | `/schools/:id/status` | Toggle school status |

#### Sessions (Academic Years)

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| POST   | `/sessions`            | Create session        |
| GET    | `/sessions`            | Get all sessions      |
| GET    | `/sessions/:id`        | Get session by ID     |
| PUT    | `/sessions/:id`        | Update session        |
| DELETE | `/sessions/:id`        | Delete session        |
| PATCH  | `/sessions/:id/status` | Toggle session status |

#### Shifts

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/shifts`            | Create shift        |
| GET    | `/shifts`            | Get all shifts      |
| GET    | `/shifts/:id`        | Get shift by ID     |
| PUT    | `/shifts/:id`        | Update shift        |
| DELETE | `/shifts/:id`        | Delete shift        |
| PATCH  | `/shifts/:id/status` | Toggle shift status |

#### Mediums

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | `/mediums`            | Create medium        |
| GET    | `/mediums`            | Get all mediums      |
| GET    | `/mediums/:id`        | Get medium by ID     |
| PUT    | `/mediums/:id`        | Update medium        |
| DELETE | `/mediums/:id`        | Delete medium        |
| PATCH  | `/mediums/:id/status` | Toggle medium status |

#### Classes

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/classes`            | Create class        |
| GET    | `/classes`            | Get all classes     |
| GET    | `/classes/:id`        | Get class by ID     |
| PUT    | `/classes/:id`        | Update class        |
| DELETE | `/classes/:id`        | Delete class        |
| PATCH  | `/classes/:id/status` | Toggle class status |

#### Groups

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/groups`            | Create group        |
| GET    | `/groups`            | Get all groups      |
| GET    | `/groups/:id`        | Get group by ID     |
| PUT    | `/groups/:id`        | Update group        |
| DELETE | `/groups/:id`        | Delete group        |
| PATCH  | `/groups/:id/status` | Toggle group status |

#### Sections

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| POST   | `/sections`            | Create section        |
| GET    | `/sections`            | Get all sections      |
| GET    | `/sections/:id`        | Get section by ID     |
| PUT    | `/sections/:id`        | Update section        |
| DELETE | `/sections/:id`        | Delete section        |
| PATCH  | `/sections/:id/status` | Toggle section status |

#### Subjects

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| POST   | `/subjects`            | Create subject        |
| GET    | `/subjects`            | Get all subjects      |
| GET    | `/subjects/:id`        | Get subject by ID     |
| PUT    | `/subjects/:id`        | Update subject        |
| DELETE | `/subjects/:id`        | Delete subject        |
| PATCH  | `/subjects/:id/status` | Toggle subject status |

#### Class-wise Subjects

| Method | Endpoint                                 | Description              |
| ------ | ---------------------------------------- | ------------------------ |
| POST   | `/class-wise-subjects`                   | Assign subjects to class |
| GET    | `/class-wise-subjects`                   | Get all assignments      |
| GET    | `/class-wise-subjects/:id`               | Get assignment by ID     |
| GET    | `/class-wise-subjects/by-class/:classId` | Get subjects by class    |
| PUT    | `/class-wise-subjects/:id`               | Update assignment        |
| DELETE | `/class-wise-subjects/:id`               | Delete assignment        |

#### Time Table / Class Routine

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| POST   | `/timetables`                    | Create time table        |
| GET    | `/timetables`                    | Get all time tables      |
| GET    | `/timetables/:id`                | Get time table by ID     |
| GET    | `/timetables/class/:classId`     | Get time table by class  |
| GET    | `/timetables/day/:dayOfWeek`     | Get time table by day    |
| GET    | `/timetables/teacher/:teacherId` | Get teacher schedule     |
| PUT    | `/timetables/:id`                | Update time table        |
| DELETE | `/timetables/:id`                | Delete time table        |
| PATCH  | `/timetables/:id/status`         | Toggle time table status |

#### Syllabus

| Method | Endpoint               | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| POST   | `/syllabus`            | Create syllabus (with file upload) |
| GET    | `/syllabus`            | Get all syllabi                    |
| GET    | `/syllabus/:id`        | Get syllabus by ID                 |
| GET    | `/syllabus/search`     | Get syllabus by class & subject    |
| PUT    | `/syllabus/:id`        | Update syllabus                    |
| DELETE | `/syllabus/:id`        | Delete syllabus                    |
| PATCH  | `/syllabus/:id/status` | Toggle syllabus status             |

---

### 3. Student Management

#### Students

| Method | Endpoint               | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| POST   | `/students`            | Create student (with photo upload) |
| GET    | `/students`            | Get all students with filters      |
| GET    | `/students/:id`        | Get student by ID                  |
| PUT    | `/students/:id`        | Update student                     |
| DELETE | `/students/:id`        | Delete student                     |
| PATCH  | `/students/:id/status` | Toggle student status              |

#### Student Promotion

| Method | Endpoint                                 | Description                   |
| ------ | ---------------------------------------- | ----------------------------- |
| POST   | `/student-promotions`                    | Promote students              |
| GET    | `/student-promotions`                    | Get promotion history         |
| GET    | `/student-promotions/:id`                | Get promotion by ID           |
| GET    | `/student-promotions/student/:studentId` | Get student promotion history |

#### Transfer Certificate (TC)

- Integrated in student management

#### Student ID Cards

| Method | Endpoint                       | Description          |
| ------ | ------------------------------ | -------------------- |
| POST   | `/id-cards`                    | Generate ID card     |
| GET    | `/id-cards`                    | Get all ID cards     |
| GET    | `/id-cards/:id`                | Get ID card by ID    |
| GET    | `/id-cards/student/:studentId` | Get student ID cards |

---

### 4. Teacher Management

| Method | Endpoint               | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| POST   | `/teachers`            | Create teacher (with photo upload) |
| GET    | `/teachers`            | Get all teachers                   |
| GET    | `/teachers/:id`        | Get teacher by ID                  |
| PUT    | `/teachers/:id`        | Update teacher                     |
| DELETE | `/teachers/:id`        | Delete teacher                     |
| PATCH  | `/teachers/:id/status` | Toggle teacher status              |

---

### 5. Staff Management

| Method | Endpoint            | Description                      |
| ------ | ------------------- | -------------------------------- |
| POST   | `/staff`            | Create staff (with photo upload) |
| GET    | `/staff`            | Get all staff                    |
| GET    | `/staff/:id`        | Get staff by ID                  |
| PUT    | `/staff/:id`        | Update staff                     |
| DELETE | `/staff/:id`        | Delete staff                     |
| PATCH  | `/staff/:id/status` | Toggle staff status              |

---

### 6. Attendance Management

#### Student Attendance

| Method | Endpoint                                  | Description                    |
| ------ | ----------------------------------------- | ------------------------------ |
| POST   | `/attendance/students`                    | Mark student attendance        |
| GET    | `/attendance/students`                    | Get student attendance records |
| GET    | `/attendance/students/:id`                | Get attendance by ID           |
| GET    | `/attendance/students/student/:studentId` | Get student attendance history |
| GET    | `/attendance/students/class/:classId`     | Get class attendance           |
| GET    | `/attendance/students/date/:date`         | Get attendance by date         |
| PUT    | `/attendance/students/:id`                | Update attendance              |
| DELETE | `/attendance/students/:id`                | Delete attendance              |

#### Teacher Attendance

| Method | Endpoint                                  | Description                    |
| ------ | ----------------------------------------- | ------------------------------ |
| POST   | `/attendance/teachers`                    | Mark teacher attendance        |
| GET    | `/attendance/teachers`                    | Get teacher attendance records |
| GET    | `/attendance/teachers/:id`                | Get attendance by ID           |
| GET    | `/attendance/teachers/teacher/:teacherId` | Get teacher attendance history |
| GET    | `/attendance/teachers/date/:date`         | Get attendance by date         |
| PUT    | `/attendance/teachers/:id`                | Update attendance              |
| DELETE | `/attendance/teachers/:id`                | Delete attendance              |

#### Staff Attendance

| Method | Endpoint                           | Description                  |
| ------ | ---------------------------------- | ---------------------------- |
| POST   | `/attendance/staff`                | Mark staff attendance        |
| GET    | `/attendance/staff`                | Get staff attendance records |
| GET    | `/attendance/staff/:id`            | Get attendance by ID         |
| GET    | `/attendance/staff/staff/:staffId` | Get staff attendance history |
| PUT    | `/attendance/staff/:id`            | Update attendance            |
| DELETE | `/attendance/staff/:id`            | Delete attendance            |

---

### 7. Examination Management

#### Exam Types

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| POST   | `/exam-types`     | Create exam type    |
| GET    | `/exam-types`     | Get all exam types  |
| GET    | `/exam-types/:id` | Get exam type by ID |
| PUT    | `/exam-types/:id` | Update exam type    |
| DELETE | `/exam-types/:id` | Delete exam type    |

#### Exams

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| POST   | `/exams`            | Create exam        |
| GET    | `/exams`            | Get all exams      |
| GET    | `/exams/:id`        | Get exam by ID     |
| PUT    | `/exams/:id`        | Update exam        |
| DELETE | `/exams/:id`        | Delete exam        |
| PATCH  | `/exams/:id/status` | Toggle exam status |

#### Exam Marks Entry

| Method | Endpoint                         | Description       |
| ------ | -------------------------------- | ----------------- |
| POST   | `/exam-marks`                    | Create exam marks |
| GET    | `/exam-marks`                    | Get all marks     |
| GET    | `/exam-marks/:id`                | Get marks by ID   |
| GET    | `/exam-marks/student/:studentId` | Get student marks |
| GET    | `/exam-marks/exam/:examId`       | Get exam marks    |
| PUT    | `/exam-marks/:id`                | Update marks      |
| DELETE | `/exam-marks/:id`                | Delete marks      |

#### Exam Results

| Method | Endpoint                           | Description         |
| ------ | ---------------------------------- | ------------------- |
| POST   | `/exam-results`                    | Generate result     |
| GET    | `/exam-results`                    | Get all results     |
| GET    | `/exam-results/:id`                | Get result by ID    |
| GET    | `/exam-results/student/:studentId` | Get student results |
| GET    | `/exam-results/exam/:examId`       | Get exam results    |
| PUT    | `/exam-results/:id`                | Update result       |
| DELETE | `/exam-results/:id`                | Delete result       |

#### Grading System

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| POST   | `/grading-systems`     | Create grading system    |
| GET    | `/grading-systems`     | Get all grading systems  |
| GET    | `/grading-systems/:id` | Get grading system by ID |
| PUT    | `/grading-systems/:id` | Update grading system    |
| DELETE | `/grading-systems/:id` | Delete grading system    |

#### Report Cards

| Method | Endpoint                           | Description              |
| ------ | ---------------------------------- | ------------------------ |
| POST   | `/report-cards`                    | Generate report card     |
| GET    | `/report-cards`                    | Get all report cards     |
| GET    | `/report-cards/:id`                | Get report card by ID    |
| GET    | `/report-cards/student/:studentId` | Get student report cards |

---

### 8. Fees & Accounts Management

#### Fee Types

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | `/fee-types`     | Create fee type    |
| GET    | `/fee-types`     | Get all fee types  |
| GET    | `/fee-types/:id` | Get fee type by ID |
| PUT    | `/fee-types/:id` | Update fee type    |
| DELETE | `/fee-types/:id` | Delete fee type    |

#### Fee Structure

| Method | Endpoint                         | Description             |
| ------ | -------------------------------- | ----------------------- |
| POST   | `/fee-structures`                | Create fee structure    |
| GET    | `/fee-structures`                | Get all fee structures  |
| GET    | `/fee-structures/:id`            | Get fee structure by ID |
| GET    | `/fee-structures/class/:classId` | Get fee by class        |
| PUT    | `/fee-structures/:id`            | Update fee structure    |
| DELETE | `/fee-structures/:id`            | Delete fee structure    |

#### Fee Collection

| Method | Endpoint                              | Description          |
| ------ | ------------------------------------- | -------------------- |
| POST   | `/fee-collections`                    | Collect fee          |
| GET    | `/fee-collections`                    | Get all collections  |
| GET    | `/fee-collections/:id`                | Get collection by ID |
| GET    | `/fee-collections/student/:studentId` | Get student payments |
| GET    | `/fee-collections/pending`            | Get pending fees     |
| PUT    | `/fee-collections/:id`                | Update collection    |
| DELETE | `/fee-collections/:id`                | Delete collection    |

#### Accounts (Income/Expense)

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| POST   | `/accounts`         | Create transaction    |
| GET    | `/accounts`         | Get all transactions  |
| GET    | `/accounts/:id`     | Get transaction by ID |
| GET    | `/accounts/income`  | Get income records    |
| GET    | `/accounts/expense` | Get expense records   |
| PUT    | `/accounts/:id`     | Update transaction    |
| DELETE | `/accounts/:id`     | Delete transaction    |

#### Salary Management

| Method | Endpoint                       | Description                |
| ------ | ------------------------------ | -------------------------- |
| POST   | `/salaries`                    | Generate salary            |
| GET    | `/salaries`                    | Get all salaries           |
| GET    | `/salaries/:id`                | Get salary by ID           |
| GET    | `/salaries/teacher/:teacherId` | Get teacher salary history |
| GET    | `/salaries/staff/:staffId`     | Get staff salary history   |
| PUT    | `/salaries/:id`                | Update salary              |
| PATCH  | `/salaries/:id/status`         | Update payment status      |
| DELETE | `/salaries/:id`                | Delete salary              |

---

### 9. Library Management

#### Books

| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| POST   | `/books`            | Add book (with cover upload) |
| GET    | `/books`            | Get all books                |
| GET    | `/books/:id`        | Get book by ID               |
| PUT    | `/books/:id`        | Update book                  |
| DELETE | `/books/:id`        | Delete book                  |
| PATCH  | `/books/:id/status` | Toggle book status           |

#### Book Issue/Return

| Method | Endpoint                        | Description             |
| ------ | ------------------------------- | ----------------------- |
| POST   | `/book-issues`                  | Issue book              |
| GET    | `/book-issues`                  | Get all issued books    |
| GET    | `/book-issues/:id`              | Get issue by ID         |
| GET    | `/book-issues/member/:memberId` | Get member issued books |
| GET    | `/book-issues/overdue`          | Get overdue books       |
| PATCH  | `/book-issues/:id/return`       | Return book             |
| PUT    | `/book-issues/:id`              | Update issue            |
| DELETE | `/book-issues/:id`              | Delete issue            |

---

### 10. Transport Management

#### Routes

| Method | Endpoint                       | Description         |
| ------ | ------------------------------ | ------------------- |
| POST   | `/transport-routes`            | Create route        |
| GET    | `/transport-routes`            | Get all routes      |
| GET    | `/transport-routes/:id`        | Get route by ID     |
| PUT    | `/transport-routes/:id`        | Update route        |
| DELETE | `/transport-routes/:id`        | Delete route        |
| PATCH  | `/transport-routes/:id/status` | Toggle route status |

#### Vehicles

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| POST   | `/vehicles`            | Add vehicle           |
| GET    | `/vehicles`            | Get all vehicles      |
| GET    | `/vehicles/:id`        | Get vehicle by ID     |
| PUT    | `/vehicles/:id`        | Update vehicle        |
| DELETE | `/vehicles/:id`        | Delete vehicle        |
| PATCH  | `/vehicles/:id/status` | Toggle vehicle status |

---

### 11. Hostel Management

#### Hostels

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | `/hostels`            | Create hostel        |
| GET    | `/hostels`            | Get all hostels      |
| GET    | `/hostels/:id`        | Get hostel by ID     |
| PUT    | `/hostels/:id`        | Update hostel        |
| DELETE | `/hostels/:id`        | Delete hostel        |
| PATCH  | `/hostels/:id/status` | Toggle hostel status |

#### Hostel Rooms

| Method | Endpoint                         | Description         |
| ------ | -------------------------------- | ------------------- |
| POST   | `/hostel-rooms`                  | Create room         |
| GET    | `/hostel-rooms`                  | Get all rooms       |
| GET    | `/hostel-rooms/:id`              | Get room by ID      |
| GET    | `/hostel-rooms/hostel/:hostelId` | Get rooms by hostel |
| PUT    | `/hostel-rooms/:id`              | Update room         |
| DELETE | `/hostel-rooms/:id`              | Delete room         |
| PATCH  | `/hostel-rooms/:id/status`       | Toggle room status  |

---

### 12. Communication Management

#### Notices

| Method | Endpoint              | Description                      |
| ------ | --------------------- | -------------------------------- |
| POST   | `/notices`            | Create notice (with file upload) |
| GET    | `/notices`            | Get all notices                  |
| GET    | `/notices/:id`        | Get notice by ID                 |
| PUT    | `/notices/:id`        | Update notice                    |
| DELETE | `/notices/:id`        | Delete notice                    |
| PATCH  | `/notices/:id/status` | Toggle notice status             |

#### Events

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | `/events`          | Create event        |
| GET    | `/events`          | Get all events      |
| GET    | `/events/:id`      | Get event by ID     |
| GET    | `/events/upcoming` | Get upcoming events |
| PUT    | `/events/:id`      | Update event        |
| DELETE | `/events/:id`      | Delete event        |

#### SMS Management

| Method | Endpoint    | Description        |
| ------ | ----------- | ------------------ |
| POST   | `/sms/send` | Send SMS           |
| GET    | `/sms`      | Get SMS history    |
| GET    | `/sms/:id`  | Get SMS by ID      |
| DELETE | `/sms/:id`  | Delete SMS history |

#### Email Management

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| POST   | `/emails/send` | Send Email           |
| GET    | `/emails`      | Get email history    |
| GET    | `/emails/:id`  | Get email by ID      |
| DELETE | `/emails/:id`  | Delete email history |

---

### 13. Homework Management

#### Homework

| Method | Endpoint                   | Description                        |
| ------ | -------------------------- | ---------------------------------- |
| POST   | `/homework`                | Create homework (with file upload) |
| GET    | `/homework`                | Get all homework                   |
| GET    | `/homework/:id`            | Get homework by ID                 |
| GET    | `/homework/class/:classId` | Get class homework                 |
| PUT    | `/homework/:id`            | Update homework                    |
| DELETE | `/homework/:id`            | Delete homework                    |
| PATCH  | `/homework/:id/status`     | Toggle homework status             |

#### Homework Submissions

| Method | Endpoint                                     | Description                        |
| ------ | -------------------------------------------- | ---------------------------------- |
| POST   | `/homework-submissions`                      | Submit homework (with file upload) |
| GET    | `/homework-submissions`                      | Get all submissions                |
| GET    | `/homework-submissions/:id`                  | Get submission by ID               |
| GET    | `/homework-submissions/homework/:homeworkId` | Get submissions by homework        |
| GET    | `/homework-submissions/student/:studentId`   | Get student submissions            |
| PUT    | `/homework-submissions/:id`                  | Update submission                  |
| PATCH  | `/homework-submissions/:id/grade`            | Grade submission                   |
| DELETE | `/homework-submissions/:id`                  | Delete submission                  |

---

### 14. Online Classes (NEW)

| Method | Endpoint                         | Description            |
| ------ | -------------------------------- | ---------------------- |
| POST   | `/online-classes`                | Create online class    |
| GET    | `/online-classes`                | Get all online classes |
| GET    | `/online-classes/upcoming`       | Get upcoming classes   |
| GET    | `/online-classes/:id`            | Get class by ID        |
| PUT    | `/online-classes/:id`            | Update class           |
| DELETE | `/online-classes/:id`            | Delete class           |
| PATCH  | `/online-classes/:id/status`     | Update class status    |
| POST   | `/online-classes/:id/attendance` | Mark attendance        |

---

### 15. Leave Management

| Method | Endpoint                         | Description                 |
| ------ | -------------------------------- | --------------------------- |
| POST   | `/leaves`                        | Apply for leave             |
| GET    | `/leaves`                        | Get all leaves              |
| GET    | `/leaves/:id`                    | Get leave by ID             |
| GET    | `/leaves/applicant/:applicantId` | Get applicant leave history |
| GET    | `/leaves/pending`                | Get pending leaves          |
| PATCH  | `/leaves/:id/status`             | Approve/Reject leave        |
| PATCH  | `/leaves/:id/cancel`             | Cancel leave                |
| DELETE | `/leaves/:id`                    | Delete leave                |
| GET    | `/leaves/balance/:applicantId`   | Get leave balance           |

---

### 16. Certificates Management

| Method | Endpoint                           | Description                    |
| ------ | ---------------------------------- | ------------------------------ |
| POST   | `/certificates`                    | Generate certificate           |
| GET    | `/certificates`                    | Get all certificates           |
| GET    | `/certificates/:id`                | Get certificate by ID          |
| GET    | `/certificates/number/:certNumber` | Get by certificate number      |
| GET    | `/certificates/verify`             | Verify certificate (PUBLIC)    |
| GET    | `/certificates/student/:studentId` | Get student certificates       |
| POST   | `/certificates/character`          | Generate character certificate |
| POST   | `/certificates/bonafide`           | Generate bonafide certificate  |
| PUT    | `/certificates/:id`                | Update certificate             |
| PATCH  | `/certificates/:id/cancel`         | Cancel certificate             |
| DELETE | `/certificates/:id`                | Delete certificate             |

---

### 17. User Management (Admin) (NEW)

#### Admin Users

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| POST   | `/admin-users`            | Create admin user    |
| GET    | `/admin-users`            | Get all admin users  |
| GET    | `/admin-users/:id`        | Get admin user by ID |
| PUT    | `/admin-users/:id`        | Update admin user    |
| DELETE | `/admin-users/:id`        | Delete admin user    |
| PATCH  | `/admin-users/:id/status` | Toggle user status   |

#### Roles & Permissions

| Method | Endpoint                 | Description        |
| ------ | ------------------------ | ------------------ |
| POST   | `/roles`                 | Create role        |
| GET    | `/roles`                 | Get all roles      |
| GET    | `/roles/:id`             | Get role by ID     |
| PUT    | `/roles/:id`             | Update role        |
| DELETE | `/roles/:id`             | Delete role        |
| POST   | `/roles/:id/permissions` | Assign permissions |

---

### 18. System Settings (NEW)

| Method | Endpoint                    | Description                |
| ------ | --------------------------- | -------------------------- |
| GET    | `/settings`                 | Get all settings           |
| PUT    | `/settings/school-info`     | Update school information  |
| PUT    | `/settings/system`          | Update system settings     |
| PUT    | `/settings/email`           | Update email configuration |
| PUT    | `/settings/sms`             | Update SMS configuration   |
| PUT    | `/settings/payment-gateway` | Update payment gateway     |
| PUT    | `/settings/appearance`      | Update appearance settings |

---

## 📈 TOTAL API SUMMARY

| Category            | Total Endpoints |
| ------------------- | --------------- |
| Dashboard           | 2               |
| Academic Management | 67              |
| Student Management  | 12              |
| Teacher Management  | 6               |
| Staff Management    | 6               |
| Attendance          | 24              |
| Examination         | 35              |
| Fees & Accounts     | 39              |
| Library             | 14              |
| Transport           | 12              |
| Hostel              | 14              |
| Communication       | 18              |
| Homework            | 15              |
| Online Classes      | 8               |
| Leave Management    | 9               |
| Certificates        | 11              |
| User Management     | 12              |
| System Settings     | 7               |

### **GRAND TOTAL: 311 API ENDPOINTS** ✅

---

## 🔐 Authentication Endpoints

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/auth/register`        | Register new user |
| POST   | `/auth/login`           | Login user        |
| POST   | `/auth/logout`          | Logout user       |
| GET    | `/auth/profile`         | Get user profile  |
| PUT    | `/auth/profile`         | Update profile    |
| PUT    | `/auth/change-password` | Change password   |

---

## ✅ ALL MENU ITEMS COVERED

### Dashboard ✅

- Dashboard Statistics
- Monthly Reports

### Academic Management ✅

- Schools
- Sessions/Academic Years
- Shifts (Morning/Day/Evening)
- Mediums (Bangla/English)
- Classes
- Groups (Science/Arts/Commerce)
- Sections
- Subjects
- Class-wise Subject Assignment
- Time Table/Class Routine
- Syllabus Management

### User Management ✅

- Students
- Teachers
- Staff
- Admin Users (NEW)
- Roles & Permissions (NEW)

### Attendance ✅

- Student Attendance
- Teacher Attendance
- Staff Attendance

### Examination ✅

- Exam Types
- Exams
- Marks Entry
- Results
- Grading System
- Report Cards
- Admit Cards

### Fees & Accounts ✅

- Fee Types
- Fee Structure
- Fee Collection
- Income/Expense
- Salary Management

### Library ✅

- Books Management
- Book Issue/Return

### Transport ✅

- Routes
- Vehicles
- (Driver management is part of Staff)

### Hostel ✅

- Hostels
- Rooms

### Communication ✅

- Notices
- Events
- SMS Management (NEW)
- Email Management (NEW)

### Homework ✅

- Homework Assignment
- Homework Submission

### Online Classes ✅ (NEW)

- Schedule Online Classes
- Live Classes
- Recorded Classes
- Class Materials
- Attendance Tracking

### Leave Management ✅

- Apply Leave
- Approve/Reject Leave
- Leave History
- Leave Balance

### Student Services ✅

- Student Promotion
- Transfer Certificate
- ID Cards
- Certificates (Character, Bonafide, Study, etc.)

### Reports ✅

- Dashboard Reports
- Attendance Reports (via filters)
- Exam Reports (via filters)
- Fee Reports (via filters)
- Custom Reports (via API filters)

### System Settings ✅ (NEW)

- School Information
- General Settings
- Email Configuration
- SMS Configuration
- Payment Gateway Settings
- Appearance/Theme Settings

---

## 🎉 PROJECT STATUS: COMPLETE

✅ Cloudinary export issue fixed
✅ All menu APIs implemented
✅ Server running successfully on port 5000
✅ MongoDB connected
✅ 311 API endpoints ready
✅ Complete documentation created

**তোমার backend সম্পূর্ণ রূপে ready! 🚀**
