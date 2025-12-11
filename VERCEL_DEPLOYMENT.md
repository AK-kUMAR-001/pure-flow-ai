# Deploy AquaAdapt to Vercel - Step by Step Guide

## ✅ Prerequisites
- Vercel account (sign up at vercel.com - FREE)
- GitHub account with your code
- Domain name (optional, can use vercel's subdomain)

---

## 📋 Step 1: Prepare Your Project

Your project is ready! Just ensure everything is committed to Git:

```powershell
cd "c:\Users\rathn\OneDrive\Desktop\sih\pure-flow-ai-main"
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

---

## 🚀 Step 2: Deploy to Vercel

### Method 1: Using Vercel CLI (Fastest)

1. **Install Vercel CLI:**
```powershell
npm install -g vercel
```

2. **Login to Vercel:**
```powershell
vercel login
```

3. **Deploy your project:**
```powershell
cd "c:\Users\rathn\OneDrive\Desktop\sih\pure-flow-ai-main"
vercel --prod
```

4. **Follow the prompts:**
   - Confirm project name: `aquaadapt`
   - Keep build settings default
   - Link to existing project? → No (first time)

**Done!** Your app will be live at: `https://aquaadapt.vercel.app`

---

### Method 2: Using Vercel Dashboard (Web UI)

1. Go to **vercel.com** → Sign up/Login
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**

---

## 🌍 Step 3: Connect Your Domain

If you own `aquaadapt.app`:

1. Go to Vercel Dashboard
2. Select your project
3. **Settings** → **Domains**
4. Add domain: `aquaadapt.app`
5. Follow instructions to update DNS at your domain registrar

---

## ⚙️ Step 4: Environment Variables (Important!)

Your app uses Supabase. Add environment variables in Vercel:

1. **Project Settings** → **Environment Variables**
2. Add these variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_API_URL=https://your-backend.vercel.app
VITE_WS_URL=wss://your-backend.vercel.app
```

---

## 🔧 Step 5: Deploy Backend (IoT Server)

The backend (port 5000) needs separate deployment:

### Option A: Deploy Backend to Railway.app (Recommended)

1. Go to **railway.app** → Sign up → Connect GitHub
2. Create new project from GitHub
3. Configure:
   - **Start command**: `npm run sensor:server`
   - **Port**: 5000
4. Get your backend URL: `https://your-app.railway.app`
5. Update Vercel environment variables with this URL

### Option B: Deploy to Render.com (Also Free)

Similar process - create new Web Service from GitHub

---

## 📊 Step 6: Monitor Your Deployment

Vercel Dashboard shows:
- ✅ Deployment status
- 📊 Analytics & Performance
- 🔍 Preview links
- 🚀 Auto-deployment on Git push

---

## 🧪 Testing After Deployment

```bash
# Test frontend
curl https://aquaadapt.vercel.app

# Test API (if backend deployed)
curl https://your-backend.vercel.app/health
```

---

## 📱 For Your Domain (aquaadapt.app)

If you already own the domain:

1. **Buy domain** (if not owned) at:
   - GoDaddy
   - Namecheap
   - Google Domains

2. **Add to Vercel:**
   - Dashboard → Settings → Domains
   - Add your domain
   - Update DNS nameservers to Vercel's

3. **Wait 24-48 hours** for DNS propagation

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project deployed to Vercel
- [ ] Environment variables added
- [ ] Backend deployed separately
- [ ] Domain connected (optional)
- [ ] Test login/signup works
- [ ] Test sensor data display works

---

## 🆘 Troubleshooting

**App shows blank page?**
- Check browser console for errors
- Verify environment variables are set
- Check Vercel deployment logs

**API calls failing?**
- Verify backend is deployed and running
- Check CORS settings in backend
- Update environment variables

**Database not working?**
- Verify Supabase credentials in env vars
- Check Supabase permissions
- Review CORS settings

---

## 🎉 Success!

Your AquaAdapt app is now live and accessible worldwide! 

Share your link: `https://aquaadapt.vercel.app`

---

## Next Steps (Optional)

1. **Mobile App**: Convert to PWA or React Native
2. **Custom Domain**: Connect aquaadapt.app
3. **SSL Certificate**: Automatic with Vercel
4. **CDN**: Automatic with Vercel (worldwide fast!)
5. **Monitoring**: Set up error tracking with Sentry

---

**Questions?** Check Vercel docs: https://vercel.com/docs
