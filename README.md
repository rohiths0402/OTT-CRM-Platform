<<<<<<< HEAD
OTT CRM Platform

A centralized OTT business management platform consisting of three independent CRM applications: User CRM, Production House CRM, and Celebrity CRM.



The project aims to provide a professional, responsive, and maintainable interface for subscriber management, production operations, celebrity management, and business analytics.



1\. Project Overview

The platform consists of three CRM modules:



User CRM

Subscriber management

KYC verification

Wallet management and transactions

Reward points management

User engagement analytics

Viewing history

Notifications

Frontend Developer: Rohith



Production House CRM

Production house management

OTT project management

Production schedules and shooting locations

Budget management

Contracts and payment tracking

Team coordination

Frontend Developer: Muzzamil

Backend Developer: Krishnamurthy



Celebrity CRM

Celebrity profile management

Talent manager management

Brand endorsements

Contracts and payments

Shooting schedules and OTT projects

Celebrity performance analytics

Frontend Developer: Chandra Soodan

Backend Developer: Sudarson



2\. Technology Stack

Layer	Technology

Frontend	React.js

Styling	Tailwind CSS

Backend	Java

Database	MySQL

Version Control	Git and GitHub

3\. Team Members and Responsibilities

No.	Team Member	Role	Assigned Module

1	Muzzamil	MERN Stack Developer / Frontend Developer	Production House CRM — Frontend

2	Krishnamurthy	Backend Developer	Production House CRM — Backend

3	Chandra Soodan	Frontend Developer	Celebrity CRM — Frontend

4	Sudarson	Backend Developer	Celebrity CRM — Backend

5	Rohith	Frontend Developer	User CRM — Frontend

Responsibilities

Muzzamil: Develop the Production House CRM interface, dashboards, forms, tables, and responsive layouts.

Krishnamurthy: Develop Java backend APIs, business logic, database integration, and CRUD operations for the Production House CRM.

Chandra Soodan: Develop the Celebrity CRM interface, celebrity profiles, contract views, schedules, and responsive layouts.

Sudarson: Develop Java backend APIs, business logic, database integration, and CRUD operations for the Celebrity CRM.

Rohith: Develop the User CRM interface, subscriber dashboard, user management screens, KYC views, wallet interface, and engagement analytics.

4\. UI/UX Requirements

All three CRM applications must follow these design requirements:



Professional premium dark theme.

Responsive design for desktop, tablet, and mobile devices.

Consistent design language across all three CRMs.

CRM-specific navigation and dashboard layouts.

Modern cards, tables, charts, and status indicators.

Functional forms with validation.

Search, filtering, sorting, and pagination where appropriate.

Reusable React components and maintainable code.

Clear loading, empty, success, and error states.

Accessible and user-friendly interactions.

5\. Development Milestones

Milestone 1: Login and Registration Pages

Date: 29 October 2026



Deliverables:



Login page UI.

User registration page UI.

Responsive layouts for desktop, tablet, and mobile.

Form validation and appropriate error messages.

Consistent dark-theme styling.

Navigation between login and registration pages.

Completion criteria:



Both pages render correctly across supported screen sizes.

Required fields are validated.

Invalid inputs display clear feedback.

Layouts follow the agreed design standards.

Backend authentication integration is coordinated with the respective backend team.

Login and registration pages must not be considered fully functional authentication until the backend integration, password handling, and session or token management have been implemented and tested.



6\. Functional Requirements

Frontend

Build responsive React pages using Tailwind CSS.

Implement reusable layouts, navigation, forms, and UI components.

Integrate frontend screens with the appropriate backend APIs.

Display API responses and handle errors gracefully.

Avoid hardcoding production data in dashboard components.

Backend

Develop REST APIs using Java.

Implement create, read, update, and delete operations where applicable.

Validate incoming requests and return consistent responses.

Implement authentication and role-based authorization.

Integrate with MySQL using a clearly defined schema.

Apply appropriate error handling and transaction management.

Database

Use MySQL for persistent application data.

Define appropriate tables, relationships, primary keys, and foreign keys.

Maintain data integrity and use migrations or version-controlled schema changes.

Store sensitive information securely.

7\. Development Guidelines

Each developer must work on their assigned CRM module.

Agree on API contracts before frontend-backend integration.

Use Git branches for individual features and bug fixes.

Follow consistent naming conventions and folder structures.

Do not commit credentials, passwords, API keys, or database secrets.

Test changes before merging into the shared branch.

Keep frontend and backend responsibilities clearly separated.

Document API endpoints and local setup instructions.

Coordinate shared components and authentication requirements across the team.

Update task status and communicate blockers regularly.

8\. Project Structure

The following is a proposed repository structure; the final structure can be adjusted to match the team's repository strategy.



ott-crm-platform/

├── user-crm/

│   └── frontend/              # Rohith

├── production-house-crm/

│   ├── frontend/              # Muzzamil

│   └── backend/               # Krishnamurthy

├── celebrity-crm/

│   ├── frontend/              # Chandra Soodan

│   └── backend/               # Sudarson

├── docs/

│   ├── architecture.md

│   ├── api-contracts.md

│   └── database-schema.md

└── README.md



Frontend: React.js + Tailwind CSS

Backend: Java

Database: MySQL





=======
# OTT CRM Platform

A centralized OTT business management platform consisting of three independent CRM applications: User CRM, Production House CRM, and Celebrity CRM.

The project aims to provide a professional, responsive, and maintainable interface for subscriber management, production operations, celebrity management, and business analytics.

## 1. Project Overview

The platform consists of three CRM modules:

### User CRM
- Subscriber management
- KYC verification
- Wallet management and transactions
- Reward points management
- User engagement analytics
- Viewing history
- Notifications

**Frontend Developer:** Rohith

### Production House CRM
- Production house management
- OTT project management
- Production schedules and shooting locations
- Budget management
- Contracts and payment tracking
- Team coordination

**Frontend Developer:** Muzzamil  
**Backend Developer:** Krishnamurthy

### Celebrity CRM
- Celebrity profile management
- Talent manager management
- Brand endorsements
- Contracts and payments
- Shooting schedules and OTT projects
- Celebrity performance analytics

**Frontend Developer:** Chandra Soodan  
**Backend Developer:** Sudarson

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Styling | Tailwind CSS |
| Backend | Java |
| Database | MySQL |
| Version Control | Git and GitHub |

## 3. Team Members and Responsibilities

| No. | Team Member | Role | Assigned Module |
|---|---|---|---|
| 1 | Muzzamil | MERN Stack Developer / Frontend Developer | Production House CRM — Frontend |
| 2 | Krishnamurthy | Backend Developer | Production House CRM — Backend |
| 3 | Chandra Soodan | Frontend Developer | Celebrity CRM — Frontend |
| 4 | Sudarson | Backend Developer | Celebrity CRM — Backend |
| 5 | Rohith | Frontend Developer | User CRM — Frontend |

### Responsibilities

- **Muzzamil:** Develop the Production House CRM interface, dashboards, forms, tables, and responsive layouts.
- **Krishnamurthy:** Develop Java backend APIs, business logic, database integration, and CRUD operations for the Production House CRM.
- **Chandra Soodan:** Develop the Celebrity CRM interface, celebrity profiles, contract views, schedules, and responsive layouts.
- **Sudarson:** Develop Java backend APIs, business logic, database integration, and CRUD operations for the Celebrity CRM.
- **Rohith:** Develop the User CRM interface, subscriber dashboard, user management screens, KYC views, wallet interface, and engagement analytics.

## 4. UI/UX Requirements

All three CRM applications must follow these design requirements:

- Professional premium dark theme.
- Responsive design for desktop, tablet, and mobile devices.
- Consistent design language across all three CRMs.
- CRM-specific navigation and dashboard layouts.
- Modern cards, tables, charts, and status indicators.
- Functional forms with validation.
- Search, filtering, sorting, and pagination where appropriate.
- Reusable React components and maintainable code.
- Clear loading, empty, success, and error states.
- Accessible and user-friendly interactions.

## 5. Development Milestones

### Milestone 1: Login and Registration Pages

**Date:** 29 October 2026

**Deliverables:**
- Login page UI.
- User registration page UI.
- Responsive layouts for desktop, tablet, and mobile.
- Form validation and appropriate error messages.
- Consistent dark-theme styling.
- Navigation between login and registration pages.

**Completion criteria:**
- Both pages render correctly across supported screen sizes.
- Required fields are validated.
- Invalid inputs display clear feedback.
- Layouts follow the agreed design standards.
- Backend authentication integration is coordinated with the respective backend team.

> Login and registration pages must not be considered fully functional authentication until the backend integration, password handling, and session or token management have been implemented and tested.

## 6. Functional Requirements

### Frontend
- Build responsive React pages using Tailwind CSS.
- Implement reusable layouts, navigation, forms, and UI components.
- Integrate frontend screens with the appropriate backend APIs.
- Display API responses and handle errors gracefully.
- Avoid hardcoding production data in dashboard components.

### Backend
- Develop REST APIs using Java.
- Implement create, read, update, and delete operations where applicable.
- Validate incoming requests and return consistent responses.
- Implement authentication and role-based authorization.
- Integrate with MySQL using a clearly defined schema.
- Apply appropriate error handling and transaction management.

### Database
- Use MySQL for persistent application data.
- Define appropriate tables, relationships, primary keys, and foreign keys.
- Maintain data integrity and use migrations or version-controlled schema changes.
- Store sensitive information securely.

## 7. Development Guidelines

1. Each developer must work on their assigned CRM module.
2. Agree on API contracts before frontend-backend integration.
3. Use Git branches for individual features and bug fixes.
4. Follow consistent naming conventions and folder structures.
5. Do not commit credentials, passwords, API keys, or database secrets.
6. Test changes before merging into the shared branch.
7. Keep frontend and backend responsibilities clearly separated.
8. Document API endpoints and local setup instructions.
9. Coordinate shared components and authentication requirements across the team.
10. Update task status and communicate blockers regularly.

## 8. Project Structure

The following is a proposed repository structure; the final structure can be adjusted to match the team's repository strategy.

```text
ott-crm-platform/
├── user-crm/
│   └── frontend/              # Rohith
├── production-house-crm/
│   ├── frontend/              # Muzzamil
│   └── backend/               # Krishnamurthy
├── celebrity-crm/
│   ├── frontend/              # Chandra Soodan
│   └── backend/               # Sudarson
├── docs/
│   ├── architecture.md
│   ├── api-contracts.md
│   └── database-schema.md
└── README.md
```


**Frontend:** React.js + Tailwind CSS
 
**Backend:** Java  
**Database:** MySQL
>>>>>>> a4be4bb261273c536a143d74c429dd1e58903364
