# Pak Homies Industry

B2B Apparel Manufacturing for Black-Owned Brands

## Overview

This is a full-stack B2B apparel manufacturing website built with React, Express, and MySQL.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, tRPC
- **Database**: MySQL with Drizzle ORM
- **Authentication**: JWT-based auth
- **Payments**: Stripe integration
- **3D Design**: Three.js / React Three Fiber

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials and API keys

# Run database migrations
pnpm db:push

# Seed sample data
pnpm db:seed

# Start development server
pnpm dev
```

## Customization

This project uses a template configuration system. To customize:

1. Edit files in `template-config/`:
   - `brand.config.ts` - Site name, contact info, SEO
   - `categories.config.ts` - Product categories
   - `theme.config.ts` - Colors and styling

2. Run `pnpm apply-template` to apply changes

3. Restart the dev server

## Features

- ✨ Product catalog with categories
- 🎨 3D Design Studio for custom apparel
- 🛒 Shopping cart and checkout
- 📄 RFQ (Request for Quote) system
- 🔐 Admin dashboard
- 📝 Blog system
- 🖼️ Portfolio/Gallery
- 📐 Tech Pack Creator

## License

Private - Pak Homies Industry
