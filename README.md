🚀 VentureScope – VC Discovery & Intelligence Interface

🌐 Live Demo: https://venture-scope-one.vercel.app/

------------------------------------------------------------------------

🧭 Overview

VentureScope is a venture capital-style company discovery and
intelligence interface designed to simulate real VC sourcing workflows:

Discover → Save → Organize → Enrich → Evaluate

The application focuses on workflow clarity, usability, and safe
integration of live website enrichment via server-side APIs.

------------------------------------------------------------------------

✨ Features


• Company discovery dashboard

• Global search & faceted filters (Industry / Stage)

• Sorting & pagination

• Company profile pages

• Research notes workspace

• Save companies

• List management (create / add / remove)

• CSV / JSON export

• Saved searches

• Live website enrichment

• Investment score & signals

• Dark / Light theme

• Responsive layout

------------------------------------------------------------------------

🧠 Enrichment Engine

Endpoint: POST /api/enrich

Server Responsibilities:

✔ Input validation

✔ Website normalization

✔ Live website fetch

✔ Structured intelligence extraction


Response Includes: 

• Summary

• What they do

• Keywords

• Signals

• Investment Score

• Risk & Verdict

• Sources

• Timestamp

------------------------------------------------------------------------

🛠 Tech Stack

Frontend: - React - TypeScript - Vite - CSS

Backend: - Node.js - Express - Axios

Persistence: - LocalStorage

------------------------------------------------------------------------

⚙️ Local Setup

1.  Clone repository
2.  Install dependencies → npm install
3.  Run development server → npm run dev

Runs on:

Frontend → http://localhost:5173

Backend → http://localhost:5000

------------------------------------------------------------------------

🌍 API Endpoint

POST /api/enrich

Request Body: { “name”: “Company Name”, “website”: “company.com” }

------------------------------------------------------------------------

📦 Data

✔ Seeded using mock company dataset

✔ Live enrichment from public websites on demand

------------------------------------------------------------------------

🎯 Assignment Context

Built as part of a VC Discovery & Intelligence Interface Assignment.

Focus Areas: 

• Realistic VC workflow design

• Server-side enrichment integration

• Safe API architecture

• Live data pull

• Clean UI/UX

------------------------------------------------------------------------

👨‍💻 Author

Rajat Bhakte
