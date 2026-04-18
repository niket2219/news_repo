# 📰 News Channel — MERN Stack Website

A full-featured bilingual (Hindi + English) news website for your YouTube channel.

## 🏗️ Project Structure

```
news-app/
├── server/             # Express + MongoDB backend
│   ├── index.js        # Server entry point
│   ├── models/         # Mongoose models (Article, User)
│   ├── routes/         # API routes (auth, articles)
│   ├── middleware/     # JWT auth, Multer image upload
│   └── uploads/        # Stored images (auto-created)
│
├── client/             # React frontend
│   └── src/
│       ├── pages/      # Home, Article, Category, Admin pages
│       ├── components/ # Header, Footer, Sidebar, AdPanel, ArticleCard
│       ├── context/    # AuthContext, LangContext (Hindi/English toggle)
│       ├── utils/      # Axios API config
│       └── styles/     # Global CSS
│
└── package.json        # Root scripts for running both
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)

### 2. Install Dependencies

```bash
# From the root news-app/ folder
npm run install-all
```

Or manually:
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and a strong JWT secret
```

**.env file:**
```
MONGO_URI=mongodb://localhost:27017/newsdb
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

### 4. Create First Admin Account

Start the server, then run this **once**:
```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@yourchannel.com","password":"yourpassword"}'
```

Or use Postman / Thunder Client.

### 5. Run the App

```bash
# From root — runs both server and client
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 🔧 Features

### Public Website
- 🏠 **Homepage** — Breaking news ticker, hero section, article grid
- 📰 **Article Page** — Full bilingual article with image gallery, view counter
- 🗂️ **Category Pages** — Filter by Politics, Sports, Tech, Entertainment, etc.
- 🌐 **Hindi/English Toggle** — Switch language on any page
- 📱 **Responsive** — Works on mobile, tablet, desktop

### Admin Panel (`/admin`)
- 🔐 **Login** — JWT-secured admin access
- 📊 **Dashboard** — Stats: total articles, views, published/drafts
- ✍️ **Article Editor**
  - Write title, summary, content in **both Hindi and English**
  - Upload multiple images (stored in MongoDB + disk)
  - First image auto-set as cover photo
  - Basic HTML formatting supported (`<p>`, `<b>`, `<h3>`, `<ul>`)
  - Category selection, tags
  - Publish/Draft toggle
- ✅ **Manage Articles** — Edit, delete, publish/unpublish

### Ad System
- 4 ad slots ready:
  - Header banner (728×90)
  - Left sidebar (160×600)
  - Right sidebar — multiple slots (300×250, 300×300)
  - In-article banner (728×90)
  - Between articles in grid (728×90)
- Replace `<AdPanel>` components with actual ad code (Google AdSense, etc.)

---

## 🗺️ API Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/setup` | No | Create first admin (run once) |
| POST | `/api/auth/login` | No | Admin login |
| GET | `/api/articles` | No | Get all articles (paginated, filterable) |
| GET | `/api/articles/latest` | No | Get 5 latest articles |
| GET | `/api/articles/:id` | No | Get single article |
| GET | `/api/articles/admin` | ✅ | Get all articles (admin) |
| POST | `/api/articles` | ✅ | Create article + images |
| PUT | `/api/articles/:id` | ✅ | Update article |
| DELETE | `/api/articles/:id` | ✅ | Delete article |

---

## 🎨 Adding Real Ads

In `client/src/components/AdPanel.js`, the `<AdPanel>` component is a placeholder.
To add real ads, replace each `<AdPanel>` in any page/component with your ad code:

```jsx
// Example: Google AdSense
<ins className="adsbygoogle"
  style={{ display: 'block' }}
  data-ad-client="ca-pub-XXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto" />
```

---

## 🚀 Deployment

### Backend (Railway / Render / VPS)
1. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`
2. `npm start` from `server/`

### Frontend (Vercel / Netlify)
1. Build: `cd client && npm run build`
2. Set API proxy or update `REACT_APP_API_URL` to your backend URL

### MongoDB
Use [MongoDB Atlas](https://www.mongodb.com/atlas) for free cloud database.

---

## 📞 Support
Built with ❤️ for your news channel. Add your channel link in the Footer component!
