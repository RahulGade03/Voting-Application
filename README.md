# 🗳️ OpenBallot – A Decentralized Voting Application

## 🚀 Overview
**OpenBallot** is a secure, blockchain-based voting system designed to provide transparency, fairness, and simplicity in online elections.  
The platform enables **admins** to create and manage polls and **voters** to cast their votes safely using a web interface.

The system focuses on:
- Immutable voting through Ethereum blockchain
- Robust authentication with cookies & JWT  
- Secure REST API using Node.js, Express, and MongoDB  
- Real-time state management with Redux  
- Modern UI with React  
- Cross-origin communication with CORS configuration  
- Deployment on **Vercel** for both frontend and backend

---

## 🧩 Tech Stack

### Frontend
- React.js (Vite)
- React Router v6
- Redux Toolkit (for state management)
- Context Api
- React Toastify (for notifications)
- TailwindCSS / Shadcn UI (for styling)
- Fetch API with `credentials: "include"` for secure cookie communication
- MetaMask
- Web3

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (stored in cookies)
- Cookie Parser
- Web3
- CORS (Cross-Origin Resource Sharing)
- dotenv (for environment configuration)

### Deployment
- Frontend → **Vercel**
- Backend → **Vercel**
- Database → **MongoDB Atlas**
- Votes → **Ethereum Sepolia Test Network**

---

## ⚙️ Project Setup

### 🖥️ 1. Clone the Repository
```bash
git clone https://github.com/RahulGade03/OpenBallot.git
cd OpenBallot
```

### 📦 2. Setup the Backend
```bash
cd backend
npm install
```

#### Create a `.env` file
```bash
JWT_SECRET_KEY=
MONGO_URI=
PORT=
WEB3_PROVIDER_URL=
CONTRACT_ADDRESS=
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=
```

---

### 🌐 3. Setup the Frontend
```bash
cd frontend
npm install
npm run dev
```

#### `vercel.json` (to fix refresh 404 issue)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```
### 🌐 3. Setup the MetaMask
```bash
create account at metamask
update the settings to show the sepolia test network
mine the sepolia ethers through https://sepolia-faucet.pk910.de/
get the expension for your browser
```
---

## 👨‍💻 Contributors
- **Rahul Gade** — Developer, Architect, and Designer
- **Urza Rai** — Developer, Architect, and Designer

---

## 🏁 License
Feel free to use, modify, and distribute with proper attribution.
