# 🚀 Deploy to Render - Step by Step Guide

This guide will help you deploy your QuickCommerce Compare app to Render.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com) (free tier available)
3. **MongoDB** (optional) - For database features (can use MongoDB Atlas free tier)
4. **Redis** (optional) - For caching (can skip for basic deployment)

---

## 🎯 Deployment Options

### Option 1: Single Service (Recommended - Simpler)
Deploy backend that serves both API and frontend static files.

### Option 2: Two Services
Deploy backend and frontend separately (more flexible).

---

## 📦 Option 1: Single Service Deployment

### Step 1: Prepare Your Code

1. **Make sure your code is pushed to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

### Step 2: Deploy on Render

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name:** `quickcommerce-backend` (or your preferred name)
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build:client`
   - **Start Command:** `npm start`
   - **Plan:** `Free` (or choose a paid plan)

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   ```
   NODE_ENV = production
   PORT = 10000 (Render will override this, but good to set)
   ```
   
   Optional (if using database):
   ```
   MONGODB_URI = your_mongodb_connection_string
   REDIS_URL = your_redis_url (optional)
   ```

6. **Click "Create Web Service"**

7. **Wait for deployment** (5-10 minutes for first build)

8. **Your app will be live at:** `https://your-service-name.onrender.com`

### Step 3: Update CORS (if needed)

The server already includes Render URLs in CORS. If you deploy frontend separately, add your frontend URL to the `FRONTEND_URL` environment variable.

---

## 📦 Option 2: Two Services Deployment

### Part A: Deploy Backend

1. **Go to Render Dashboard → "New +" → "Web Service"**
2. **Connect GitHub repository**
3. **Configure:**
   - **Name:** `quickcommerce-backend`
   - **Root Directory:** `/` (root of repo)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

4. **Environment Variables:**
   ```
   NODE_ENV = production
   PORT = 10000
   FRONTEND_URL = https://your-frontend-name.onrender.com (set after frontend deploys)
   ```

5. **Click "Create Web Service"**
6. **Copy the backend URL** (e.g., `https://quickcommerce-backend.onrender.com`)

### Part B: Deploy Frontend

1. **Go to Render Dashboard → "New +" → "Static Site"**
2. **Connect GitHub repository**
3. **Configure:**
   - **Name:** `quickcommerce-frontend`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

4. **Environment Variables:**
   ```
   REACT_APP_API_URL = https://your-backend-url.onrender.com
   ```

5. **Click "Create Static Site"**
6. **Update backend `FRONTEND_URL`** with your frontend URL

---

## 🔧 Configuration Details

### Build Process

**For Single Service:**
- Builds both backend dependencies and frontend React app
- Serves static files from `client/build` in production
- API routes work at `/api/*`

**For Two Services:**
- Backend: Only installs backend dependencies
- Frontend: Builds React app separately

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | Set to `production` |
| `PORT` | Auto | Render sets this automatically |
| `MONGODB_URI` | No | MongoDB connection string |
| `REDIS_URL` | No | Redis connection string |
| `FRONTEND_URL` | No | Frontend URL (for CORS) |
| `REACT_APP_API_URL` | No | Backend URL (for frontend) |

---

## 🐛 Troubleshooting

### Build Fails

1. **Check build logs** in Render dashboard
2. **Common issues:**
   - Missing dependencies → Check `package.json`
   - Build timeout → Upgrade to paid plan or optimize build
   - Memory issues → Add `NODE_OPTIONS=--max-old-space-size=4096`

### API Not Working

1. **Check CORS settings** - Make sure frontend URL is allowed
2. **Check environment variables** - Ensure `REACT_APP_API_URL` is set
3. **Check server logs** - Look for errors in Render dashboard

### Frontend Can't Connect to Backend

1. **Verify `REACT_APP_API_URL`** is set correctly
2. **Check backend is running** - Visit backend health endpoint
3. **Check CORS** - Backend must allow frontend origin

### Free Tier Limitations

- **Spins down after 15 minutes** of inactivity
- **First request after spin-down takes ~30 seconds**
- **Upgrade to paid plan** for always-on service

---

## 🔄 Auto-Deploy

Render automatically deploys when you push to your main branch (if connected via GitHub).

To disable auto-deploy:
1. Go to service settings
2. Disable "Auto-Deploy"

---

## 📝 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Service created and configured
- [ ] Environment variables set
- [ ] Build successful
- [ ] App accessible at Render URL
- [ ] API endpoints working
- [ ] Frontend connecting to backend (if separate)

---

## 🎉 After Deployment

1. **Test your app** at the Render URL
2. **Share the URL** with others
3. **Monitor logs** in Render dashboard
4. **Set up custom domain** (optional, in service settings)

---

## 💡 Pro Tips

1. **Use Render's free PostgreSQL** if you need a database
2. **Set up health checks** for better monitoring
3. **Use environment groups** to manage variables across services
4. **Enable auto-deploy** for continuous deployment
5. **Monitor usage** to avoid hitting free tier limits

---

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **Render Support:** support@render.com
- **Check build logs** in Render dashboard for specific errors

---

**Happy Deploying! 🚀**

