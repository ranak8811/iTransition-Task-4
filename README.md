# User Management Web Application (Task 4)

A professional, responsive, and secure User Management Web Application featuring user registration, asynchronous email verification, JWT authentication, and an administrative control panel to manage user status (block, unblock, delete, delete unverified).

**Live Demo (Frontend):** [https://itransition-task4-frontend-u9m3.onrender.com](https://itransition-task4-frontend-u9m3.onrender.com)  
**API Endpoint (Backend):** [https://itransition-task4-backend-ahyj.onrender.com](https://itransition-task4-backend-ahyj.onrender.com)

---

## 🚀 Key Features

1. **Secure Registration & Authentication:**
   * Password hashing using `bcryptjs`.
   * JWT-based session management and token validation.
2. **Asynchronous Email Verification:**
   * Sends transactional HTML verification emails using the **Brevo (Sendinblue) API** asynchronously.
   * Restores status from `unverified` to `active` upon token confirmation.
3. **Database-Level Consistency:**
   * Guarantees email uniqueness strictly on the database storage level via a `UNIQUE INDEX` constraint (does not rely on manual pre-check SELECT queries).
4. **Interactive Admin Panel:**
   * A responsive user table sorted by `lastLoginTime` (most active users at the top).
   * Multi-selection checkbox controls (Select All/Deselect All).
   * Dynamic Admin Toolbar containing: **Block** (button with text), **Unblock** (lock icon), **Delete** (trash icon), and **Delete Unverified** (clean trash icon). The toolbar dynamically activates/disables based on the checkbox selection.
5. **Real-time Status Guards:**
   * Protects all administrative routes via custom middleware.
   * If a user account is blocked or deleted, the next request automatically fails and redirects the client to the login screen immediately (applies to self-blocking actions as well).

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Tailwind CSS (v4), Axios (interceptors), React Router DOM (v7).
* **Backend:** Node.js, Express, ES Modules.
* **Database & ORM:** PostgreSQL (Neon Serverless), Prisma 7 ORM, `@prisma/adapter-pg` driver adapter.
* **Email Service:** Brevo SMTP / HTTP Transactional Mail API.
* **Hosting:** Render (Static Site for Frontend, Web Service for Backend).

---

## 📂 Project Structure

```text
iTransition-Task-4/
├── backend/
│   ├── index.js                     # Main Express entry point
│   ├── .env                         # Backend environment configurations
│   ├── prisma.config.ts             # Prisma 7 configuration file
│   ├── prisma/
│   │   ├── schema.prisma            # Prisma schema (Models)
│   │   └── migrations/              # Database migration history
│   └── src/
│       ├── config/
│       │   └── db.js                # Prisma Client & Postgres Adapter setup
│       ├── controllers/
│       │   └── authController.js    # Register, login, email verification controllers
│       │   └── userController.js    # Fetch, block, unblock, delete controllers
│       ├── middleware/
│       │   └── authMiddleware.js    # JWT authorization and status verification
│       ├── routes/
│       │   └── authRoutes.js        # Authentication endpoints
│       │   └── userRoutes.js        # User management endpoints
│       └── utils/
│           ├── helpers.js           # Password hashing & Token generation helpers
│           └── emailService.js      # Brevo transactional email sender
├── frontend/
│   ├── index.html                   # Entry HTML page
│   ├── vite.config.js               # Vite bundler configuration
│   └── src/
│       ├── api.js                   # Axios client with request/response interceptors
│       ├── main.jsx                 # Vite application mount
│       ├── App.jsx                  # Router definitions (Register, Login, Dashboard)
│       └── pages/
│           ├── Register.jsx         # Sign up screen
│           ├── Login.jsx            # Sign in screen
│           └── Dashboard.jsx        # Admin User Management Table & Toolbar
└── Instructions/                    # Step-by-step part guides
```

---

## ⚙️ Environment Variables Setup

### Backend Config (`backend/.env`)
Create a `.env` file inside the `backend/` directory:
```env
PORT=4000
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<dbname>?sslmode=require"
CLIENT_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000
JWT_SECRET=your_jwt_signing_secret_key
BREVO_API_KEY=your_brevo_xkeysib_api_key
BREVO_SENDER_EMAIL=your-verified-brevo-sender@domain.com
BREVO_SENDER_NAME="iTransition App"
```

### Frontend Config (`frontend/.env`)
Create a `.env` file inside the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:4000
```

---

## 💻 Local Installation & Setup

### Prerequisites
Make sure you have Node.js (v18+) and PostgreSQL installed on your local machine.

### 1. Database Setup & Migration
Set up your PostgreSQL database connection in `backend/.env`. Then, in the `backend/` directory, run the migration to create tables and unique indexes:
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
```

### 2. Run Backend
Start the Express server:
```bash
npm run dev
```
The server will start running on `http://localhost:4000` and confirm the database connection.

### 3. Run Frontend
In a separate terminal, navigate to the `frontend/` directory and start the Vite dev server:
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## ☁️ Production Deployment

### Database (Neon.tech)
* Run `npx prisma db push` targeting your Neon database connection string to instantly load the schema.
* To list the unique index database constraints on your tables, run:
  ```sql
  SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'users';
  ```

### Backend & Frontend (Render)
1. **Express Backend:** Deployed as a Web Service. Ensure `Root Directory` is set to `backend`, Build Command to `npm install && npx prisma generate`, and Start Command to `node index.js`. Add all backend environment variables.
2. **React Frontend:** Deployed as a Static Site. Ensure `Root Directory` is set to `frontend`, Build Command to `npm install && npm run build`, and Publish Directory to `dist`.
3. **SPA Rewrite Config:** Under **Redirects/Rewrites** settings for your frontend static site on Render, add a rewrite rule mapping Source: `/*` to Destination: `/index.html` with Action: `Rewrite` to support client-side routing.
4. **CORS:** Match the backend `CLIENT_URL` variable exactly to the deployed frontend domain.
