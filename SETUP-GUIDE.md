# 📘 Complete Setup Guide

This guide walks you through setting up your B2B apparel manufacturing website from this template.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **pnpm** - Install with: `npm install -g pnpm`
- **MySQL Database** - Local or hosted (Hostinger, PlanetScale, etc.)
- **Git** - For version control

## 🚀 Step-by-Step Setup

### Step 1: Create from Template

#### Option A: GitHub Template (Easiest)

1. Visit the template repository on GitHub
2. Click **"Use this template"** → **"Create a new repository"**
3. Name your repository (e.g., `my-apparel-brand`)
4. Click **"Create repository"**
5. Clone your new repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/my-apparel-brand.git
   cd my-apparel-brand
   ```

#### Option B: Direct Download

```bash
# Download and extract the template
curl -L -o template.zip https://github.com/original/template/archive/main.zip
unzip template.zip
cd template-main

# Initialize as new project
rm -rf .git
rm -rf security-uniforms/.git
git init
git add .
git commit -m "Initial commit from template"
```

### Step 2: Install Dependencies

```bash
# Navigate to the main project folder
cd security-uniforms

# Install all dependencies
pnpm install
```

### Step 3: Configure Your Brand

Edit these files to customize for your brand:

#### 3.1 Brand Settings

Edit `template-config/brand.config.ts`:

```typescript
export const BRAND_CONFIG = {
  siteName: "Your Brand Name",           // ← Change this
  tagline: "Your Tagline Here",          // ← Change this
  legalName: "Your Legal Company Name",  // ← Change this
  establishedYear: 2020,                 // ← Change this
  siteUrl: "https://yoursite.com",       // ← Change this
  
  supportEmail: "support@yoursite.com",  // ← Change this
  salesEmail: "sales@yoursite.com",      // ← Change this
  phone: "+1-555-123-4567",              // ← Change this
  
  location: "Your City, Country",        // ← Change this
  fullAddress: "123 Your Street\nCity, State ZIP\nCountry",
  
  // Review and update all other settings...
};
```

#### 3.2 Product Categories

Edit `template-config/categories.config.ts`:

Replace the sample categories with your actual product categories:

```typescript
export const CATEGORIES_CONFIG: Category[] = [
  {
    id: "your-category-1",
    name: "Your Category Name",
    slug: "your-category-slug",
    description: "Description of your category",
    icon: "🎯",  // Emoji or icon
    showInNav: true,
    sortOrder: 1,
    seo: {
      title: "Your SEO Title",
      description: "Your SEO description",
      keywords: "keywords, for, seo",
    },
    subCategories: [
      { id: "sub1", name: "Subcategory 1", slug: "sub1", description: "..." },
      // Add more subcategories
    ],
  },
  // Add more categories
];
```

#### 3.3 Theme Colors

Edit `template-config/theme.config.ts`:

```typescript
export const THEME_CONFIG = {
  colors: {
    primary: {
      500: "#your-brand-color",  // ← Your main brand color
      // Adjust other shades as needed
    },
    // ... rest of config
  },
};
```

### Step 4: Apply Template Configuration

Run the template application script:

```bash
pnpm apply-template
```

This will:
- ✅ Update category definitions in the codebase
- ✅ Generate CSS variables from your theme config
- ✅ Update HTML metadata
- ✅ Create brand constants
- ✅ Generate a new README

### Step 5: Setup Database

#### 5.1 Create MySQL Database

**Option A: Hostinger (Recommended for production)**
1. Log in to your Hostinger control panel
2. Go to Databases → MySQL Databases
3. Create a new database and user
4. Note the connection details

**Option B: Local MySQL**
```bash
mysql -u root -p
CREATE DATABASE apparel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'apparel_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON apparel_db.* TO 'apparel_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 5.2 Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="mysql://username:password@hostname:3306/database_name"

# Example for Hostinger:
# DATABASE_URL="mysql://u123456789_user:password@srv123.hstgr.io:3306/u123456789_dbname"

# Example for local development:
# DATABASE_URL="mysql://apparel_user:password@localhost:3306/apparel_db"

# Security
JWT_SECRET="your-super-secret-key-change-this"

# Optional: AI Features
GEMINI_API_KEY="your-gemini-api-key"

# Optional: Payments
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

#### 5.3 Run Database Migrations

```bash
pnpm db:push
```

This creates all the necessary tables in your database.

### Step 6: Seed Sample Data

```bash
pnpm db:seed
```

This adds:
- Sample products based on your categories
- Sample testimonials
- Admin user (login: `admin@example.com` / `admin123`)

**⚠️ Important**: Change the admin password immediately after first login!

### Step 7: Add Your Images

Place your product images in:

```
client/public/images/
├── products/          # Product photos
│   ├── product-1.jpg
│   └── product-2.jpg
├── hero/             # Homepage hero images
│   └── hero-bg.jpg
├── about/            # About page images
│   └── team.jpg
└── logo.svg          # Your logo
```

**Image Guidelines:**
- Product images: 1200x1200px, white background
- Hero images: 1920x1080px, high quality
- Logo: SVG format preferred

### Step 8: Start Development Server

```bash
pnpm dev
```

Your site will be available at: `http://localhost:3000`

Admin panel: `http://localhost:3000/admin-login`

### Step 9: Customize Content

#### Update Homepage Content

Edit `client/src/pages/Home.tsx`:
- Hero headline and subheadline
- Stats/numbers
- Services/features
- Testimonials

#### Update About Page

Edit `client/src/pages/About.tsx`:
- Company story
- Team information
- Facility photos

#### Update Contact Page

Edit `client/src/pages/Contact.tsx`:
- Office locations
- Contact forms
- Map coordinates

### Step 10: Deploy to Production

#### Option A: Hostinger (Shared Hosting)

1. **Build for production:**
   ```bash
   pnpm build:local
   ```

2. **Upload files:**
   - Upload `dist/client/` contents to `public_html/`
   - Upload `dist/` (server files) to a separate directory
   - Set up Node.js app in Hostinger panel

3. **Set environment variables** in Hostinger panel

4. **Configure domain** and SSL

#### Option B: Vercel (Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option C: VPS (DigitalOcean, Linode, etc.)

```bash
# Build locally
pnpm build:local

# Copy to server
rsync -avz dist/ user@server:/var/www/app/

# Setup PM2 on server
pm2 start dist/index.js --name "apparel-site"
```

## 🔄 Making Updates

### Update Categories

1. Edit `template-config/categories.config.ts`
2. Run `pnpm apply-template`
3. Restart dev server

### Update Branding

1. Edit `template-config/brand.config.ts`
2. Run `pnpm apply-template`
3. Restart dev server

### Update Theme

1. Edit `template-config/theme.config.ts`
2. Run `pnpm apply-template`
3. Changes apply immediately

### Add New Products

Use the admin panel at `/admin-login` or:

1. Edit `template-config/seed-data/sample-products.ts`
2. Run `pnpm db:seed` (Warning: This may duplicate products)

## 🛠️ Troubleshooting

### Database Connection Error

```
Error: Access denied for user...
```

**Solution:**
- Check DATABASE_URL in .env
- Verify database user has correct permissions
- Ensure database exists

### Port Already in Use

```
Error: Port 3000 is already in use
```

**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 pnpm dev
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
cd client && rm -rf node_modules
pnpm install
```

### Template Changes Not Applied

```bash
# Force reapply template
pnpm apply-template

# Check for TypeScript errors
pnpm check
```

## 📚 Next Steps

- [ ] Add Google Analytics
- [ ] Set up email notifications
- [ ] Configure Stripe for payments
- [ ] Add more products
- [ ] Write blog posts
- [ ] Set up SSL certificate
- [ ] Configure CDN for images
- [ ] Set up backup system

## 🆘 Getting Help

- **Documentation:** Check the `docs/` folder
- **Issues:** Create an issue in your repository
- **Support:** Contact template provider

---

**Congratulations!** Your B2B apparel manufacturing website is now ready! 🎉
