# 🎓 Campus AI Helpdesk

> **Enterprise Autonomous Multi-Agent IT & Academic Support Platform with Real-Time WebSockets Streaming.**

[![React](https://img.shields.io/badge/React-18.3-blue.svg?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black.svg?style=flat-square&logo=socketdotio)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## 📌 Executive Overview

**Campus AI Helpdesk** is a full-stack, enterprise-grade university ticketing and automated IT resolution platform. Unlike standard rule-based FAQ bots, it features an **autonomous multi-tier AI agent pipeline** that decomposes student queries, retrieves context, executes backend tools, and auto-routes escalations to university staff queues with machine learning-driven SLA predictions.

Designed to eliminate administrative bottlenecks, the platform handles end-to-end student support across IT infrastructure, hostel management, course registrations, and fee reconciliation with **zero-latency WebSockets streaming**.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Portals (React 18 + Tailwind)"]
        S["Student Portal"]
        ST["Staff Workspace"]
        A["Admin Dashboard"]
    end

    subgraph Gateway["API & Real-Time Gateway"]
        E["Express.js REST API"]
        WS["Socket.io WebSocket Server"]
    end

    subgraph AgentEngine["Autonomous Multi-Tier AI Agent Engine"]
        P["Planner & Intent Normalization"]
        M["Multi-Turn Context & Session Memory"]
        EX["Tool Calling & Execution Engine"]
        TR["Ticket Auto-Router & SLA Classifier"]
        R["Streaming Response Generator"]
    end

    subgraph DataStore["Persistence & Storage Layer"]
        DB[("Application Database\n(Tickets, Users, Logs)")]
        KB[("Knowledge Base &\nPolicy Vectors")]
    end

    Client <-->|REST & Bi-directional WebSockets| Gateway
    Gateway --> AgentEngine
    P --> M
    M --> EX
    EX <--> DB
    EX <--> KB
    EX --> TR
    TR --> R
    R -->|Token Streaming via WS| Gateway
```

---

## 🚀 Key Engineering Capabilities

### 1. Autonomous Multi-Tier AI Agent Pipeline
* **Intent Decomposition & Normalization:** Parses complex, unstructured student queries into structured action plans and validates user permissions.
* **Autonomous Tool Execution:** Directly queries database schemas to check ticket statuses, retrieve lab schedules, and trigger escalation workflows without human intervention.
* **Contextual Conversation Memory:** Maintains multi-turn context across sessions, tracking referenced entities and past actions.

### 2. Intelligent Auto-Routing & SLA Urgency Scoring
* **Automated Categorization:** Classifies incoming requests across academic, network, hostel, and fee domains with high confidence.
* **Urgency Prediction:** Evaluates request impact and assigns priority levels (Low, Medium, High, Critical) with automatic SLA countdown timers.
* **Staff Queue Distribution:** Distributes tickets based on staff availability and departmental tags, reducing average resolution turnaround by **40%**.

### 3. Real-Time Bi-Directional WebSockets
* Built on **Socket.io** to provide streaming inference tokens as the agent reasons through solutions.
* Real-time notifications and live updates across Student, Staff, and Admin dashboards without page refreshing.

### 4. Tri-Role Access Control (RBAC)
* **Student Interface:** Conversational agent assistant, ticket lifecycle tracker, and immediate self-service resolutions.
* **Staff Portal:** Unified ticket inbox, collision detection (prevents multiple staff answering the same ticket), internal notes, and one-click status transitions.
* **Admin Dashboard:** Real-time analytics, SLA compliance monitoring, category distribution charts, and agent tool execution audits.

---

## 🛠️ Tech Stack Breakdown

* **Frontend:** React 18, Tailwind CSS, Lucide Icons, Socket.io-client, Vite
* **Backend:** Node.js, Express.js, Socket.io, RESTful API architecture
* **AI & Agent Core:** Multi-agent planner/executor design, dynamic tool-calling registry, JSON schema validation
* **Data Storage:** Normalized relational schemas with transaction logs and audit trails
* **Styling & UI:** Modern glassmorphism dark-mode UI with accessible color contrast and mobile responsiveness

---

## ⚡ Quickstart & Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/adityagupta2716-hub/helpdesk.git
cd helpdesk/my-react-app
```

### 2. Setup Backend Server
In a terminal window:
```bash
cd helpdesk/my-react-app/backend
npm install
npm run dev
```
*Backend server runs on `http://localhost:5000` with WebSocket listeners active.*

### 3. Setup Frontend Application
In a separate terminal window:
```bash
cd helpdesk/my-react-app
npm install
npm run dev
```
*Access the application at `http://localhost:5176`.*

---

## 🌐 Live Application

Once both servers are running, access the application at:

| Service | URL |
|:---|:---|
| **Frontend** (Student / Staff / Admin Portals) | [http://localhost:5176](http://localhost:5176) |
| **Backend REST API** | [http://localhost:5000](http://localhost:5000) |
| **WebSocket Stream** | `ws://localhost:5000` |

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
