# Deployment checklist

## Required environment variables

Set these in your hosting platform:

- JWT_SECRET=your-long-random-secret
- SENDER_EMAIL=your-gmail-address@gmail.com
- SENDER_PASS=your-gmail-app-password
- MAILGUN_API_KEY=your-mailgun-api-key
- MAILGUN_DOMAIN=your-mailgun-domain
- MAILGUN_FROM='Career Wise Team <mailgun@your-domain>'
- RESET_ADDRESS=https://your-frontend-url
- MONGODB_URI=mongodb+srv://.../Careerwise?appName=Cluster0
- FRONTEND_URL=https://your-frontend-url

## Frontend

- Build command: npm run build
- Output folder: angular/dist/angular
- Runtime API base URL: set via window.__API_BASE_URL__ before app loads

## Backend

- Start command: node ./bin/www
- Port: 3000 or the platform-assigned port

## Notes

- The frontend API URL is now read from window.__API_BASE_URL__.
- The backend CORS config now accepts the configured FRONTEND_URL.
