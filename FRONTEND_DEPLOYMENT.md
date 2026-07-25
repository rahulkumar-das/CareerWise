# Frontend deployment notes

## Build settings
- Framework: Angular
- Build command: npm install && npm run build
- Output folder: angular/dist/angular

## Runtime configuration
The Angular app will use the Render backend URL by default in production:
- https://careerwise-i0ni.onrender.com

If you deploy the frontend on a different host later, update the value in angular/src/environments/environment.prod.ts.

## Important
The password reset links will use RESET_ADDRESS or FRONTEND_URL from the backend environment variables.
