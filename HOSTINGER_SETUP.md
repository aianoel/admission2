# Quick Hostinger Setup Guide

## For Hostinger Shared Hosting

### Database Choice: PostgreSQL vs MySQL

Hostinger supports both PostgreSQL and MySQL. Choose based on your preference:
- **PostgreSQL**: More advanced features, better for complex queries
- **MySQL**: Widely supported, often better performance on shared hosting

### Option A: PostgreSQL Setup

#### 1. Build Locally
```bash
npm install
npm run build
```

#### 2. Upload Files
Upload these files/folders to your Hostinger `public_html` directory:
- `dist/` (entire folder)
- `node_modules/` (entire folder)
- `.htaccess`
- `.env` (create from .env.example)

#### 3. PostgreSQL Database Setup
1. Create PostgreSQL database in Hostinger control panel
2. Update `.env` with your database URL:
```
DATABASE_URL=postgresql://username:password@hostname:port/database_name
DB_TYPE=postgresql
```

#### 4. Initialize PostgreSQL Database
Run this once to set up tables:
```bash
npm run db:push
```

### Option B: MySQL Setup (Recommended for Hostinger)

#### 1. Build Locally
```bash
npm install
npm install mysql2
npm run build
```

#### 2. Switch to MySQL
```bash
# Set environment variable
echo "DB_TYPE=mysql" >> .env
echo "DATABASE_URL=mysql://username:password@hostname:port/database_name" >> .env

# Run MySQL setup script
node scripts/mysql-setup.js
```

#### 3. Upload Files
Upload these files/folders to your Hostinger `public_html` directory:
- `dist/` (entire folder)
- `node_modules/` (entire folder)
- `shared/mysql-schema.ts`
- `server/mysql-db.ts`
- `drizzle.mysql.config.ts`
- `.htaccess`
- `.env`

#### 4. MySQL Database Setup
1. Create MySQL database in Hostinger control panel
2. Update `.env` with your MySQL database URL:
```
DATABASE_URL=mysql://username:password@hostname:port/database_name
DB_TYPE=mysql
```

#### 5. Initialize MySQL Database
Run this once to set up tables:
```bash
# Use MySQL configuration
npx drizzle-kit push --config=drizzle.mysql.config.ts
```

### 5. Start Application
```bash
node dist/index.js
```

## For Hostinger VPS

### 1. Install Node.js
```bash
# Update system
sudo apt update

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

### 2. Clone and Build
```bash
git clone your-repository
cd your-project
npm install
npm run build
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database details
nano .env
```

### 4. Setup Database
```bash
npm run db:push
```

### 5. Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Configure Nginx (Optional)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

Required:
- `DATABASE_URL` - Database connection string (PostgreSQL or MySQL)
- `DB_TYPE` - Set to "postgresql" or "mysql"
- `NODE_ENV=production`
- `PORT=5000`
- `SESSION_SECRET` - Random string

Optional:
- `OPENAI_API_KEY` - For AI features
- `SEMAPHORE_API_KEY` - For SMS notifications

### Database URL Formats:
```bash
# PostgreSQL
DATABASE_URL=postgresql://username:password@hostname:port/database_name
DB_TYPE=postgresql

# MySQL
DATABASE_URL=mysql://username:password@hostname:port/database_name
DB_TYPE=mysql
```

## Troubleshooting

### Common Issues:
1. **Node version**: Ensure Node.js 18+ is installed
2. **Port conflicts**: Change PORT in .env if needed
3. **Database**: Verify connection string format and DB_TYPE setting
4. **Permissions**: Check file permissions after upload
5. **MySQL vs PostgreSQL**: Ensure DB_TYPE matches your database URL
6. **Missing mysql2**: Run `npm install mysql2` if using MySQL

### Check Status:
```bash
# With PM2
pm2 status
pm2 logs

# Without PM2
ps aux | grep node
```

## Security Checklist
- [ ] Environment variables configured
- [ ] .env file not in version control
- [ ] Strong database password
- [ ] SSL certificate enabled
- [ ] Regular backups scheduled
- [ ] Firewall configured (VPS only)