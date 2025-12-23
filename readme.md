
# Fluid Controls Pvt Ltd. : Effective Information Flow System

**Project Provided By:** Fluid Controls Pvt. Ltd.  
**Project Title:** Effective Information Flow System  
**Industry Project**

---

## 1. Introduction

The **Effective Information Flow System** is designed to enable **timely and accurate exchange of data and instructions** among Admins, Supervisors, and Operators in a workforce environment. The system intelligently allocates manpower and tracks tasks to improve efficiency and accountability.

**Objective:**  
> To achieve timely and accurate exchange of data and instructions by effectively identifying and allocating manpower resources.

### 1.1 Scope
The system supports:  
- User management & authentication  
- Task creation, assignment, and status tracking  
- Real-time notifications and optional chat  
- Centralized document/instruction repository  
- Manpower skill mapping and availability dashboard  
- Audit logging and analytics with exportable reports

### 1.2 Users
| User | Description | Key Permissions |
|------|------------|----------------|
| Supervisor | Middle-tier user | Assign tasks, monitor teams, upload documents |
| Operator | Task executor | View/update tasks, comment, download documents |

---

## 2. System Architecture

- **Frontend:** React + Tailwind CSS  
- **Backend:** Node.js (Express) with REST APIs + WebSocket (Socket.IO)  
- **Database:** MongoDB  
- **Authentication:** JWT  
- **Hosting/Environment:**  

---

## 3. Features & Functional Requirements

### 3.1 User Management & Authentication
- **FR-UM-1:** Admin can register Supervisors/Operators (name, email, role, skills).  
- **FR-UM-2:** Users can log in with email/password; receive JWT on success.  
- **FR-UM-3:** Role-based middleware restricts access per endpoint.  
- **FR-UM-4:** Users can view/edit their profiles and upload a picture.  
- **FR-UM-5:** Password change and password reset via secure email link.  

### 3.2 Task Assignment & Tracking
- **FR-TA-1:** Supervisors can create tasks (title, description, deadline, attachments, priority).  
- **FR-TA-2:** Tasks can be assigned to Operators based on skill tags.  
- **FR-TA-3:** Tasks can be edited or reassigned.  
- **FR-TA-4:** Users can view/filter tasks by status.  
- **FR-TA-5:** Alerts are sent when deadlines approach.  

### 3.3 Real-Time Notifications & Chat
- **FR-NT-1:** Operators receive real-time notifications on task assignment or update via WebSocket.  
- **FR-NT-2:** Instruction changes trigger broadcast alerts to relevant users.  
- **FR-NT-3 (Optional):** Users can send/receive chat messages in real time; chat history is stored.  

### 3.4 Task Status Management
- **FR-TS-1:** Operators can mark tasks as “In Progress,” “On Hold,” or “Completed” with optional comments.  
- **FR-TS-2:** Supervisors can view a live dashboard of task statuses with filters.  
- **FR-TS-3:** Each task has a comment/thread for communication between users.  

### 3.5 Centralized Instruction Repository
- **FR-CR-1:** Admin/Supervisor can upload documents (PDF/Image) with metadata (title, version, tags).  
- **FR-CR-2:** System maintains version history; older versions are retrievable.  
- **FR-CR-3:** Users can search/filter documents by keyword, tag, or version.  
- **FR-CR-4:** Role-based access controls determine download/view permissions.  

### 3.6 Manpower Resource Mapping
- **FR-MP-1:** Operator profiles include skill tags and current availability.  
- **FR-MP-2:** Supervisor/Admin can update operator availability in real time.  
- **FR-MP-3:** Visual dashboards (grid/calendar) display manpower allocation.  
- **FR-MP-4:** Users can search for available manpower by skill.  

### 3.7 Audit Logs & Analytics
- **FR-AA-1:** System logs all user actions (task updates, uploads, status changes) with timestamps.  
- **FR-AA-2:** Analytics engine computes task performance (completion rates, delays).  
- **FR-AA-3:** Computes user performance metrics (workload, efficiency).  
- **FR-AA-4:** Users can export reports in CSV/PDF formats.  

---

## 4. Performance Requirements
- API response time: ≤ 200 ms under normal load  
- WebSocket event delivery latency: ≤ 100 ms  
- Full-text search queries: < 500 ms  

---

## 5. Security
- Passwords hashed using **bcrypt/Argon2**  
- HTTPS enforced for all endpoints  
- Role checks on every protected route  

---

## 6. References
* Fluid Controls Pvt. Ltd. internal SRS documentation

