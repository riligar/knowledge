# 🚀 Deploy and Hosting

This guide covers various deployment options for your project, from free hosting services to custom server deployments.

## 📋 Prerequisites

Before deploying, ensure you have:
- Built your project successfully with `bun run build`
- Tested the build locally
- All dependencies properly configured
- Environment variables set up (if needed)

## 🆓 Free Hosting Options

### **GitHub Pages**
Perfect for static sites and documentation.

```bash
# Build your project
bun run build

# Add and commit the dist folder
git add dist/
git commit -m "Deploy: Update build files"
git push origin main
```

**Configuration:**
1. Go to your repository settings
2. Navigate to "Pages" section
3. Select source: "Deploy from a branch"
4. Choose branch: `main` and folder: `/dist`
5. Save and wait for deployment

**Custom Domain (Optional):**
```bash
# Add CNAME file to dist folder
echo "yourdomain.com" > dist/CNAME
```

### **Netlify**
Excellent for modern web applications with continuous deployment.

**Method 1: Git Integration**
1. Connect your GitHub/GitLab repository
2. Configure build settings:
   - **Build command:** `bun run build`
   - **Publish directory:** `dist/`
   - **Node version:** Latest LTS
3. Deploy automatically on every push

**Method 2: Manual Deploy**
```bash
# Install Netlify CLI
bun add -g netlify-cli

# Build and deploy
bun run build
netlify deploy --prod --dir=dist
```

**Environment Variables:**
- Add in Netlify dashboard under "Site settings" → "Environment variables"

### **Vercel**
Optimized for frontend frameworks and serverless functions.

**Method 1: Git Integration**
1. Import your repository
2. Configure project:
   - **Framework Preset:** Other
   - **Build Command:** `bun run build`
   - **Output Directory:** `dist`
3. Deploy automatically

**Method 2: Vercel CLI**
```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
bun run build
vercel --prod
```

**Configuration File (vercel.json):**
```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "installCommand": "bun install"
}
```

## 🖥️ Self-Hosted Options

### **Own Server (VPS/Dedicated)**

**Basic Setup:**
```bash
# Build locally
bun run build

# Upload to server (using SCP)
scp -r dist/ user@yourserver.com:/var/www/html/

# Or using rsync
rsync -avz dist/ user@yourserver.com:/var/www/html/
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Apache Configuration (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### **Docker Deployment**

**Dockerfile:**
```dockerfile
FROM nginx:alpine

# Copy built files
COPY dist/ /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Build and Run:**
```bash
# Build your project
bun run build

# Build Docker image
docker build -t my-app .

# Run container
docker run -p 80:80 my-app
```

## 🔧 Automation & CI/CD

### **GitHub Actions**
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy with @riligar/documentation

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    
    - name: Install project dependencies
      run: bun install
    
    - name: Build with @riligar/documentation
      run: bunx @riligar/documentation build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

**Alternative workflow for different hosting platforms:**

```yaml
name: Deploy with @riligar/documentation

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    
    - name: Install dependencies
      run: bun install
    
    - name: Build documentation with @riligar/documentation
      run: bunx @riligar/documentation build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/
        
  deploy-netlify:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist/
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

**For environments without Bun, using npx:**

```yaml
name: Deploy with @riligar/documentation (Node.js)

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build with @riligar/documentation
      run: npx @riligar/documentation build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🐛 Troubleshooting

### **Common Issues:**

**Build Fails:**
- Check if all dependencies are installed: `bun install`
- Verify @riligar/documentation is accessible: `bunx @riligar/documentation --help`
- Check for TypeScript/linting errors in your content files
- Ensure your content structure follows @riligar/documentation requirements

**404 Errors on Refresh:**
- Configure server for SPA routing (see server configs above)
- Ensure `index.html` is in the root of your dist folder
- Check if @riligar/documentation generated the correct file structure

**Assets Not Loading:**
- Check base URL configuration in your content
- Verify relative paths in your markdown/content files
- Ensure assets are included in the build output
- Check if images and media files are in the correct directories

**@riligar/documentation Specific Issues:**
- Verify your content directory structure
- Check markdown syntax and frontmatter
- Ensure all required configuration files are present
- Test build locally before deploying: `bunx @riligar/documentation build`

**Environment Variables:**
- Set production environment variables in hosting platform
- Use build-time variables for static builds
- Check variable naming conventions (some platforms require specific prefixes)

## 📊 Performance Optimization

### **Before Deployment:**
```bash
# Build and test locally
bunx @riligar/documentation build

# Test build locally
cd dist && python -m http.server 8000
# Or with Bun
cd dist && bun --port 8000 .
```

### **Content Optimization:**
- Optimize images before adding to your knowledge base
- Use appropriate image formats (WebP, AVIF when possible)
- Compress large files and documents
- Organize content in logical directory structures
- Use descriptive filenames for better SEO

### **Deployment Optimization:**
- Enable gzip/brotli compression on your server
- Set up CDN for static assets
- Configure proper caching headers
- Use lazy loading for images in content
- Minify CSS and JavaScript if customizing themes

## 🔒 Security Considerations

- Always use HTTPS in production
- Set up proper CORS headers if needed
- Configure security headers (CSP, HSTS, etc.)
- Keep @riligar/documentation updated: `bunx @riligar/documentation@latest build`
- Use environment variables for sensitive configuration
- Regular security audits: `bun audit`
- Sanitize user-generated content if accepting contributions

---

**Need help?** Check the [@riligar/documentation documentation](https://github.com/riligar/documentation) or consult their support resources.
