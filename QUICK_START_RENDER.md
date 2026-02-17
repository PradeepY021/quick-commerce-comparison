# 🚀 Quick Start: Deploy to Render (5 Minutes)

## Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

## Step 2: Deploy on Render

1. **Go to [render.com](https://render.com)** and sign up/login
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub account** and select this repository
4. **Fill in the details:**
   - **Name:** `quickcommerce-app` (or any name you like)
   - **Environment:** `Node`
   - **Region:** Choose closest to you
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** Leave empty (root of repo)
   - **Build Command:** `npm install && npm run build:client`
   - **Start Command:** `npm start`
   - **Plan:** `Free` (or choose paid for always-on)

5. **Click "Create Web Service"**

6. **Wait 5-10 minutes** for the first build

## Step 3: Your App is Live! 🎉

Your app will be available at: `https://quickcommerce-app.onrender.com`

**That's it!** The app will:
- ✅ Serve your React frontend
- ✅ Handle API requests at `/api/*`
- ✅ Auto-deploy on every git push

---

## Optional: Environment Variables

If you need MongoDB or Redis, add these in Render dashboard:
- Go to your service → "Environment" tab
- Add variables:
  - `MONGODB_URI` = your MongoDB connection string
  - `REDIS_URL` = your Redis URL

---

## ⚠️ Free Tier Note

- Service spins down after 15 min of inactivity
- First request after spin-down takes ~30 seconds
- Upgrade to paid plan for always-on service

---

## 🔄 Auto-Deploy

Every time you push to GitHub, Render will automatically redeploy your app!

---

**Need help?** Check `RENDER_DEPLOYMENT.md` for detailed guide.

