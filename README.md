# 🚀 VentureScope – VC Discovery & Intelligence Interface

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)
![Express](https://img.shields.io/badge/Backend-Express-black?logo=express)
![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?logo=node.js)
![Status](https://img.shields.io/badge/Status-MVP-success)
![License](https://img.shields.io/badge/License-Educational-lightgrey)

---

## 🧭 Overview

**VentureScope** is a VC-style company discovery and intelligence interface built to simulate real venture workflows:

🔎 Discover → ⭐ Save → 📂 Organize → 🧠 Enrich → 📊 Evaluate

---

## ✨ Features

✅ Company Discovery Table  
✅ Search & Filters (Industry / Stage)  
✅ Sorting (Name / Stage)  
✅ Pagination  
✅ Save Companies  
✅ Saved View  
✅ List Management  
✅ CSV / JSON Export  
✅ Research Notes Workspace  
✅ Server-side Enrichment  
✅ Live Website Data Pull  
✅ Investment Score & Signals  
✅ Dark / Light Theme  

---

## 🧠 Enrichment Engine

Triggered from UI → calls:

POST /api/enrich

### ⚙️ Server Responsibilities

✔ Input validation  
✔ Website normalization  
✔ Live website fetch attempt  
✔ Structured intelligence response  

### 📤 Returns

• Summary  
• What they do  
• Keywords  
• Signals  
• Investment Score  
• Risk  
• Verdict  
• Sources  
• Timestamp  

---

## 🛠 Tech Stack

Frontend:
- React
- TypeScript
- Vite

Backend:
- Node.js
- Express
- Axios

Persistence:
- LocalStorage

---

## ⚙️ Local Setup

1️⃣ Clone Repository

git clone https://github.com/YOUR_USERNAME/venturescope.git  
cd venturescope

2️⃣ Install Dependencies

npm install

3️⃣ Run Development Server

npm run dev

Runs on:

Frontend → http://localhost:5173  
Backend → http://localhost:5000  

---

## 🌍 API Endpoint

POST /api/enrich

Request Body:

{
  "name": "Company Name",
  "website": "company.com"
}

---

## 📦 Data

✔ Seeded using mock company JSON dataset  
✔ Live enrichment from public websites on demand  

---

## 🎯 Assignment Context

Built as part of a VC Discovery & Intelligence Interface Assignment.

Focus Areas:

• Usable VC workflow  
• Server-side enrichment  
• Safe API design  
• Live data pull  
• Clean UI/UX  

---

## 👨‍💻 Author

Rajat Bhakte

---

⭐ If you like this project, give it a star 🌟
