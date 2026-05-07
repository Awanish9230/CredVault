# CredVault

CredVault is a production-grade digital certificate generation and verification platform built with the MERN stack (MongoDB, Express, React, Node.js). It allows organizations to issue tamper-proof certificates with modern, premium templates and instant QR/ID-based verification.

## 🚀 Features

- **Dynamic Generation**: Create professional certificates with multiple templates (Slate, Gold, Corporate).
- **Instant Verification**: Public portal to verify authenticity via Certificate ID or Direct Link.
- **Admin Dashboard**: Real-time analytics, certificate management (edit/revoke/delete), and site branding.
- **Automated Emails**: Automatically send certificates to recipients via SMTP (Brevo/SendGrid/etc).
- **Responsive Design**: Premium Light Mode UI built with Tailwind CSS and Lucide icons.
- **Security**: JWT Authentication, Route Protection, and Database Sanitization.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Recharts, Framer Motion.
- **Backend**: Node.js, Express 5, MongoDB (Mongoose).
- **Utilities**: Nodemailer (Email), Html2Canvas & JsPDF (Certificate Export), BcryptJS (Security).

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB.
- SMTP Credentials (e.g., from Brevo).

### 1. Clone the repository
```bash
git clone https://github.com/Awanish9230/CredVault.git
cd CredVault
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_smtp_key
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
```
Start the frontend:
```bash
npm run dev
```

## 🌐 Deployment (Render)

### Root Directory Setup
This project is structured as a monorepo. On Render:
1. **Frontend (Static Site)**:
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
2. **Backend (Web Service)**:
   - Root Directory: `server`
   - Start Command: `npm start`

## 🛡️ Default Credentials
Upon first run in production, the system automatically seeds a default admin:
- **Email**: `awanish@credvault.com`
- **Password**: `awanish@123`

## 📄 License
MIT License
