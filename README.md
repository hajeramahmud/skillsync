##SkillSync

A Skill-Based Team Formation and Collaboration Platform for Students

---

##📌 Project Overview

SkillSync is a skill-based team formation and collaboration platform designed for students.

The platform helps students create profiles, showcase their skills, discover suitable projects, find teammates, and collaborate effectively on projects.

SkillSync brings team formation, project collaboration, task management, notifications, and team contribution tracking together in one platform.

---

##✨ Key Features

##👤 User Profile

- Create and manage a personal profile
- Add and showcase skills
- Add a profile picture
- Update personal information and bio
- View recent activities

##🤝 Team Formation

- Showcase individual skills
- Find suitable teammates
- Form teams for different projects
- View team members and their contributions

##📂 Project Management

- Create and manage projects
- Add project descriptions
- Specify required skills
- Manage project members
- View project information

##📨 Project Applications

- Students can apply to join projects
- Project owners can manage applications
- Manage project members

##✅ Task Management

- Create and manage project tasks
- Assign tasks to team members
- Track project-related activities

##🔔 Notifications

- Receive notifications for important project activities
- Stay updated about applications and team activities

##⭐ Skill Endorsement

- Team members can endorse each other's skills
- Showcase skills and contributions within the platform

##📊 Team Contribution

- Display team members' contributions
- Track participation within projects

---

##👥 User Roles

##🎓 Student

Students can:

- Create and manage their profiles
- Add their skills
- Explore available projects
- Apply to join projects
- Join project teams
- Complete assigned tasks
- View notifications
- Receive skill endorsements

##👑 Project Owner

Project owners can:

- Create projects
- Define required skills
- View project applicants
- Manage team members
- Assign project tasks
- Monitor team contributions

---

##🛠️ Technology Stack

##Frontend

- React.js
- React Router
- JavaScript
- CSS

##Backend

- Node.js
- Express.js

##Database

- MongoDB
- Mongoose

##Tools & Deployment

- Git
- GitHub
- Vercel

---

##🏗️ System Architecture

SkillSync follows a client-server architecture. The React frontend communicates with the Node.js and Express backend through REST APIs. The backend handles application logic and communicates with MongoDB using Mongoose.

Architecture Flow

┌─────────────────────────┐
│      React Frontend     │
│                         │
│  Pages / Components     │
│  React Router           │
└────────────┬────────────┘
             │
             │ REST API
             ▼
┌─────────────────────────┐
│    Node.js + Express    │
│                         │
│       Routes            │
│          ↓              │
│     Controllers        │
│          ↓              │
│        Models           │
└────────────┬────────────┘
             │
             │ Mongoose
             ▼
┌─────────────────────────┐
│        MongoDB          │
│                         │
│       Database          │
└─────────────────────────┘

---

##🔄 How SkillSync Works

Student
   ↓
Register / Login
   ↓
Create Profile
   ↓
Add Skills
   ↓
Explore Projects
   ↓
Find Suitable Project
   ↓
Apply to Join
   ↓
Project Owner Reviews Application
   ↓
Join Team
   ↓
Work on Tasks
   ↓
Track Team Contribution
   ↓
Collaborate with Team Members

---

##🌟 Why SkillSync?

Finding the right teammates for a project can be difficult for students, especially when they do not know who has the required skills.

SkillSync addresses this problem by providing a platform where students can showcase their skills, discover projects, find suitable teammates, and collaborate in an organized environment.

---

##⚠️ Current Limitations

Although SkillSync provides several features for student collaboration and team formation, the current version has some limitations:

- Skill matching is currently based on the skills provided by users.
- Advanced AI-based recommendation or skill-matching is not currently implemented.
- Real-time chat or messaging is not currently available.
- Video conferencing and online meeting features are not included.
- Advanced project analytics and performance reports are not currently implemented.
- The notification system currently focuses on platform-related activities.

---

##💻 Local Installation

Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB
- Git

1. Clone the Repository

git clone https://github.com/hajeramahmud/skillsync.git

2. Navigate to the Project

cd skillsync

3. Setup Frontend

cd frontend
npm install
npm run dev

The frontend will run on the local development server.

4. Setup Backend

Open another terminal:

cd backend
npm install
node server.js

The backend server will start using the configured port.

---

##📁 Project Structure

skillsync/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── ...
│
├── docs/
│
├── package.json
├── package-lock.json
└── README.md

---


##🌐 Live Demo

Live Website:
skillsync-lac-nu.vercel.app
---


##📄 License

This project was created for academic learning and practical implementation as part of the Web Programming Lab course at Metropolitan University.

---


