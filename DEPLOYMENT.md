# Deployment Guide - Render.com

## Prerequisites
1. GitHub account with this repository
2. Render.com account (free, no credit card required)
3. MongoDB Atlas account (free)

## Step-by-Step Deployment

### 1. Setup MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (Free M0 tier)
4. Create database user:
   - Username: `yogaai`
   - Password: (generate strong password)
5. Add IP whitelist: `0.0.0.0/0` (allow from anywhere)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Save this for later

### 2. Deploy to Render.com

#### Option A: Using Blueprint (Recommended - Deploy All at Once)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will detect `render.yaml`
6. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: (auto-generated)
7. Click "Apply"
8. Wait 10-15 minutes for all services to deploy

#### Option B: Manual Deployment (One by One)

**Frontend (Static Site):**
1. New → Static Site
2. Connect repository
3. Build command: `cd frontend && npm install && npm run build`
4. Publish directory: `frontend/dist`

**Backend (Web Service):**
1. New → Web Service
2. Connect repository
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: (generate random string)
   - `PORT`: 5001

**ML Pose Service:**
1. New → Web Service
2. Connect repository
3. Root directory: `backend/Ml`
4. Build command: `pip install -r requirements.txt`
5. Start command: `python app.py`
6. Environment: Python 3

**Diet Service:**
1. New → Web Service
2. Connect repository
3. Root directory: `backend/Diet_Recommendation_System`
4. Build command: `pip install -r requirement.txt`
5. Start command: `python app.py`
6. Environment: Python 3

**Photo Server:**
1. New → Web Service
2. Connect repository
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node photo-server.js`
6. Environment variables:
   - `MONGODB_URI`: Your MongoDB connection string

### 3. Update Frontend Environment Variables

After all services are deployed, update frontend environment variables:

1. Go to frontend service settings
2. Add environment variables:
   ```
   VITE_API_URL=https://yoga-backend.onrender.com
   VITE_ML_API_URL=https://yoga-ml-pose.onrender.com
   VITE_DIET_API_URL=https://yoga-diet.onrender.com
   ```
3. Redeploy frontend

### 4. Configure CORS in Backend

Update backend CORS to allow your frontend domain:
- Add your Render frontend URL to CORS origins

### 5. Test Your Deployment

1. Visit your frontend URL
2. Test login/register
3. Test pose detection
4. Test diet recommendations
5. Test payment (eSewa test mode)

## Important Notes

- **Free tier limitations**: Services sleep after 15 minutes of inactivity
- **First request**: May take 30-60 seconds to wake up
- **Solution**: Use UptimeRobot (free) to ping services every 14 minutes
- **Database**: MongoDB Atlas free tier is 512MB

## Troubleshooting

### Services won't start:
- Check logs in Render dashboard
- Verify environment variables
- Check build logs for errors

### Database connection fails:
- Verify MongoDB connection string
- Check IP whitelist (should be 0.0.0.0/0)
- Verify database user credentials

### CORS errors:
- Add frontend URL to backend CORS configuration
- Redeploy backend service

## URLs After Deployment

- Frontend: `https://yoga-frontend.onrender.com`
- Backend: `https://yoga-backend.onrender.com`
- ML Service: `https://yoga-ml-pose.onrender.com`
- Diet Service: `https://yoga-diet.onrender.com`
- Photo Server: `https://yoga-photo.onrender.com`

## Cost

**Total: $0/month**
- Render.com: Free tier (750 hours/month per service)
- MongoDB Atlas: Free tier (512MB)

Perfect for academic projects and demos!
