# Nexora LMS 🚀

Nexora is a high-performance Learning Management System with integrated live classes, real-time coding sandboxes, and advanced student analytics.

## 🌟 Key Features
- **Live Class Hub**: Full-featured Jitsi Meet integration with screen sharing and chat.
- **Integrated Practice Arena**: Real-time coding sandbox for live tasks (integrated with Newton School URLs).
- **Course Management**: Admin can create courses, schedule classes, and manage assignments.
- **Student Analytics**: Granular tracking of assignment views, raw code submissions, and XP.
- **Leaderboard**: Global student ranking based on performance.

## 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS v4, Lucide Icons, Axios.
- **Backend**: Node.js, Express, MongoDB, JWT.

---

## 🚀 How to Get Your Live URL

To make this portal work from any computer, follow these 3 steps:

### 1. Database (MongoDB Atlas)
Since `localhost` won't work on the internet, you need a free cloud database:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Get your **Connection String** (e.g., `mongodb+srv://...`).
3. You will need this for the backend deployment.

### 2. Backend Deployment (Render)
1. Sign up on [Render.com](https://render.com).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository `nexora-lms`.
4. It will automatically detect `render.yaml`.
5. **Important**: Add your `MONGO_URI` (from Atlas) and a `JWT_SECRET` in the Render Dashboard environment settings.
6. Once deployed, copy your **Backend URL** (e.g., `https://nexora-api.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Sign up on [Vercel.com](https://vercel.com).
2. Import your `nexora-lms` repository.
3. Select the `client` folder as the root.
4. **Important**: Add an environment variable `VITE_API_URL` with the value of your **Backend URL** + `/api` (e.g., `https://nexora-api.onrender.com/api`).
5. Click **Deploy**.

**You now have a live working URL! 🎉**

---

## 👨‍💻 Local Development
1. Clone the repo.
2. `cd server && npm install && npm start`
3. `cd client && npm install && npm run dev`

Enjoy Nexora!
