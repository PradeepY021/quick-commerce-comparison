# 🚀 Push Your Code to GitHub - Step by Step

Since your repository isn't on GitHub yet, follow these steps:

## Step 1: Initialize Git (if not done)

Open your terminal in the project folder and run:

```bash
cd /Users/pradeepyadav/quick-commerce-comparison
git init
```

## Step 2: Create a GitHub Repository

1. **Go to [github.com](https://github.com)** and sign in
2. **Click the "+" icon** (top right) → **"New repository"**
3. **Fill in the details:**
   - **Repository name:** `quick-commerce-comparison` (or any name you prefer)
   - **Description:** "Price comparison platform for quick-commerce platforms"
   - **Visibility:** Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. **Click "Create repository"**

## Step 3: Add All Files and Commit

```bash
# Make sure you're in the project directory
cd /Users/pradeepyadav/quick-commerce-comparison

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for Render deployment"
```

## Step 4: Connect to GitHub and Push

GitHub will show you commands after creating the repo. Use these:

```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/quick-commerce-comparison.git

# Or if you prefer SSH:
# git remote add origin git@github.com:YOUR_USERNAME/quick-commerce-comparison.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

## Step 5: Connect to Render

Now go back to your Render dashboard:
1. **Refresh the page** or click "New +" → "Web Service" again
2. **You should now see** `quick-commerce-comparison` in the repository list
3. **Select it** and continue with deployment

---

## Alternative: If You Already Have a Different GitHub Repo

If you have a repository with a different name:

1. **Find your repository name** on GitHub
2. **In Render**, search for it in the repository list
3. **Or manually enter the repository URL** in Render

---

## Troubleshooting

### "Repository not found"
- Make sure you're logged into the correct GitHub account in Render
- Check that the repository name matches exactly
- Try disconnecting and reconnecting GitHub in Render settings

### "Permission denied"
- Make sure Render has access to your repositories
- Go to Render Settings → GitHub → Check permissions

### "Already have a repo with this name"
- Either rename your GitHub repo, or
- Use the existing repo and just push your code to it

---

## Quick Command Summary

```bash
cd /Users/pradeepyadav/quick-commerce-comparison
git init
git add .
git commit -m "Initial commit - Ready for Render deployment"
git remote add origin https://github.com/YOUR_USERNAME/quick-commerce-comparison.git
git branch -M main
git push -u origin main
```

**After pushing, refresh your Render dashboard and you should see the repository!**

