# CRM Frontend

This is the **frontend** of the CRM platform built with **React (Vite)**.  
Link to backend repository of this project : https://github.com/Rajkaran2004Singh/CRM_BACKEND.
It provides an interface to manage customers, create and deliver campaigns, build customer segments, and use AI-powered tools.

---

## Features

-  **Google Authentication** (via backend with Passport.js)  
-  **Customer Management** (list and manage customer data)  
-  **Campaigns** (create, schedule, and deliver personalized campaigns)  
-  **Segments** (rule-based filtering of customers)  
-  **AI Tools** (content suggestions / personalization)  
-  **Dashboard** (overview of campaigns, customers, and communication logs)  
-  **Protected Routes** — only accessible when logged in  
-  **Netlify Deployment** with `_redirects` file for client-side routing

---

## 🛠️ Tech Stack

- [React](https://react.dev/) (with [Vite](https://vitejs.dev/))
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/) (API requests)
- [TailwindCSS](https://tailwindcss.com/) (styling)
- Deployed on [Netlify](https://www.netlify.com/)

---

## Project Structure
```
frontend/

├── public/

│ └── _redirects # Required for Netlify routing

├── src/

│ ├── components/ # React components

│ │ ├── Navbar.jsx

│ │ ├── Dashboard.jsx

│ │ ├── Customers.jsx

│ │ ├── Campaigns.jsx

│ │ └── Segments.jsx

│ ├── App.jsx # Routes configuration

│ ├── main.jsx # Entry point

│ └── index.css # Global styles

├── package.json

└── vite.config.js

```

---

## Setup (Local Development)

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/crm-frontend.git
   cd crm-frontend
2. Install dependencies
   npm install
3. Start developmental run
   npm run dev

Link to deployed CRM porject : https://crm-platform-rajkaran.netlify.app
