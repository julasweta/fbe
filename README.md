# FBE - Fullstack E-commerce Project

**FBE** is a full-featured e-commerce application for managing products, carts, orders, and users.

**Live Production:** https://fbe.pp.ua/  
**Backend API:** https://fbe-8ldlbw.fly.dev/api 

## Technologies
- **Backend:** Node.js, Nest.js, Prisma, PostgreSQL
- **Frontend:** React, TypeScript
- **Deployment:** Fly.io
- **CI/CD:** GitHub Actions

## Key Features
- User management with roles (ADMIN, USER, CUSTOMER)
- Shopping cart and order management
- Product, category, and collection management
- Authentication using JWT
- Telegram notifications integration

## Demo
[Live Demo](https://fbe-8ldlbw.fly.dev/)

## Local Setup
```bash
# Clone the repository
git clone https://github.com/julasweta/fbe.git
cd backend

# Install dependencies
npm install

# Set up environment variables as .env.example
DATABASE_URL="postgresql://..."

# Generate Prisma client
npx prisma generate

# Run backend
npm run start:dev

