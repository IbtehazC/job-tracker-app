# Deploying to Cloudflare Pages

This guide will help you deploy your Job Tracker app to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (free tier works fine)
2. Wrangler CLI installed (already included in dev dependencies)

## Deployment Steps

### Option 1: Deploy via CLI (Recommended)

1. **Login to Cloudflare**
   ```bash
   npx wrangler login
   ```
   This will open your browser to authenticate with Cloudflare.

2. **Build and Deploy**
   ```bash
   npm run deploy
   ```
   This command will:
   - Build your Next.js app as a static site
   - Deploy the `out` directory to Cloudflare Pages

3. **Follow the prompts**
   - First deployment: You'll be asked to create a new project
   - Enter a project name (e.g., "job-tracker-app")
   - Wrangler will create the project and deploy

4. **Access your site**
   - Once deployed, you'll get a URL like: `https://job-tracker-app.pages.dev`
   - Your site is now live!

**Alternative: Direct Command**

If you prefer to specify everything in one command:
```bash
npm run build
npx wrangler pages deploy out --project-name=job-tracker-app
```

### Option 2: Deploy via Cloudflare Dashboard

1. **Build your app locally**
   ```bash
   npm run build
   ```

2. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com/
   - Go to "Workers & Pages" → "Create application" → "Pages" → "Upload assets"

3. **Upload the `out` directory**
   - Drag and drop the entire `out` folder
   - Name your project
   - Click "Deploy site"

### Option 3: Connect GitHub Repository (Auto-Deploy on Push)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Cloudflare deployment configuration"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to: https://dash.cloudflare.com/
   - Navigate to "Workers & Pages" → "Create application" → "Pages" → "Connect to Git"
   - Select your repository

3. **Configure build settings**
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node.js version: `20` (or latest LTS)

4. **Deploy**
   - Click "Save and Deploy"
   - Cloudflare will automatically deploy on every push to your main branch

## Environment Variables

Since this app uses localStorage for mock data, no environment variables are needed for the initial deployment. When you integrate Firebase later, you'll need to add:

1. Go to your Cloudflare Pages project
2. Navigate to "Settings" → "Environment variables"
3. Add your Firebase configuration variables

## Custom Domain (Optional)

1. Go to your Cloudflare Pages project
2. Navigate to "Custom domains"
3. Click "Set up a custom domain"
4. Follow the instructions to add your domain

## Testing Before Deployment

Preview your production build locally:
```bash
npm run build
npm run preview
```

This will start a local server serving the static files from the `out` directory, exactly as they'll appear on Cloudflare.

## Troubleshooting

### Build Fails
- Make sure all dependencies are installed: `npm install`
- Check that your Node.js version is 18 or higher: `node -v`

### 404 Errors
- Ensure `output: 'export'` is set in `next.config.ts`
- Check that all routes are static (no server-side rendering)

### Images Not Loading
- Verify `images.unoptimized: true` is set in `next.config.ts`
- External images should have proper CORS headers

## Next Steps

Once deployed, you can:
1. Test all features on the live site
2. Share the URL with others
3. Proceed with Firebase backend integration
4. Set up a custom domain

## Useful Commands

```bash
# Deploy to production
npm run deploy

# Preview production build locally
npm run preview

# Check deployment status
npx wrangler pages deployment list

# View deployment logs
npx wrangler pages deployment tail
```

## Support

For more information:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
