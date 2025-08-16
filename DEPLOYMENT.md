# EduManage - Hostinger Deployment Guide

## Prerequisites

- Node.js 18+ installed on your Hostinger hosting
- Database: PostgreSQL OR MySQL (both supported on Hostinger)
- Access to your Hostinger hosting control panel

## Database Selection

EduManage supports both PostgreSQL and MySQL. Choose based on:

**PostgreSQL** (Original):
- Advanced features and JSON support
- Better for complex queries
- Original development database

**MySQL** (Recommended for Hostinger):
- Excellent performance on shared hosting
- Widely supported by hosting providers
- Often faster for web applications
- Better memory efficiency

## Step 1: Prepare Your Database

### For PostgreSQL:
1. Create a PostgreSQL database in your Hostinger control panel
2. Note down the database credentials:
   - Host
   - Port (usually 5432)
   - Database name
   - Username
   - Password

### For MySQL (Recommended):
1. Create a MySQL database in your Hostinger control panel
2. Note down the database credentials:
   - Host
   - Port (usually 3306)
   - Database name
   - Username
   - Password

## Step 2: Build the Application

1. Clone your repository locally
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application for production:
   ```bash
   npm run build
   ```

4. This creates:
   - `dist/public/` - Frontend build files
   - `dist/index.js` - Backend server file

## Step 3: Upload Files to Hostinger

1. Upload the following to your Hostinger file manager:
   - `dist/` folder (entire contents)
   - `node_modules/` folder
   - `.htaccess` file (for Apache routing)
   - Any other necessary files

2. File structure on Hostinger should be:
   ```
   public_html/
   ├── dist/
   │   ├── public/        # Frontend files
   │   └── index.js       # Backend server
   ├── node_modules/
   ├── .htaccess
   └── .env
   ```

## Step 4: Configure Environment Variables

### For PostgreSQL:
1. Create a `.env` file in your root directory with:
   ```
   DATABASE_URL=postgresql://username:password@hostname:port/database_name
   DB_TYPE=postgresql
   NODE_ENV=production
   PORT=5000
   SESSION_SECRET=your-super-secret-session-key
   ```

### For MySQL:
1. Create a `.env` file in your root directory with:
   ```
   DATABASE_URL=mysql://username:password@hostname:port/database_name
   DB_TYPE=mysql
   NODE_ENV=production
   PORT=5000
   SESSION_SECRET=your-super-secret-session-key
   ```

2. Replace the database URL with your actual Hostinger database credentials

## Step 5: Database Setup

### For PostgreSQL:
1. Connect to your database and run the schema setup:
   ```bash
   npm run db:push
   ```

### For MySQL:
1. Install MySQL driver and setup:
   ```bash
   npm install mysql2
   node scripts/mysql-setup.js
   ```

2. Or manually push MySQL schema:
   ```bash
   npx drizzle-kit push --config=drizzle.mysql.config.ts
   ```

3. This will create all necessary tables and relationships

## Step 6: Start the Application

1. On Hostinger, you can start the application using:
   ```bash
   cd /path/to/your/app
   node dist/index.js
   ```

2. Or set up a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name "edumanage"
   pm2 save
   pm2 startup
   ```

## Step 7: Configure Domain

1. Point your domain to the application
2. Ensure the application is accessible via your domain
3. The .htaccess file handles client-side routing

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | Database connection string (PostgreSQL or MySQL) | Yes |
| DB_TYPE | Database type: "postgresql" or "mysql" | Yes |
| NODE_ENV | Set to "production" | Yes |
| PORT | Server port (usually 5000) | Yes |
| SESSION_SECRET | Random secret for sessions | Yes |
| OPENAI_API_KEY | For AI features | Optional |
| SEMAPHORE_API_KEY | For SMS notifications | Optional |

## Troubleshooting

### Common Issues:

1. **Port Issues**: Ensure PORT environment variable matches Hostinger's requirements
2. **Database Connection**: Verify DATABASE_URL is correct
3. **File Permissions**: Ensure uploaded files have correct permissions
4. **Node Version**: Ensure Hostinger supports Node.js 18+

### Checking Logs:

- Check Hostinger error logs in control panel
- Use `pm2 logs` if using PM2
- Add console.log statements for debugging

### Performance Optimization:

- Enable GZIP compression (included in .htaccess)
- Use CDN for static assets
- Optimize database queries
- Monitor memory usage

## Security Considerations

1. **Environment Variables**: Never commit .env file to version control
2. **Database**: Use strong passwords and limit access
3. **Session Secret**: Use a long, random string
4. **HTTPS**: Enable SSL certificate on Hostinger
5. **Regular Updates**: Keep dependencies updated

## Maintenance

1. **Backups**: Regular database backups
2. **Monitoring**: Set up uptime monitoring
3. **Updates**: Plan for application updates
4. **Logs**: Regular log rotation and cleanup

## Support

For Hostinger-specific issues:
- Contact Hostinger support
- Check Hostinger documentation
- Verify Node.js and database service status

For application issues:
- Check application logs
- Verify environment variables
- Test database connectivity