# MySQL Migration Guide for Hostinger

This guide helps you migrate your EduManage system from PostgreSQL to MySQL for Hostinger deployment.

## Prerequisites

- MySQL 8.0+ database (available on Hostinger)
- Node.js 18+ environment
- Current PostgreSQL database with data (optional migration)

## MySQL Setup on Hostinger

### 1. Create MySQL Database

1. Log into your Hostinger control panel
2. Go to "Databases" > "MySQL Databases"
3. Create a new database:
   - Database name: `edumanage_db`
   - Username: `edumanage_user`
   - Password: (strong password)
4. Note the database host (usually localhost or specific hostname)

### 2. Get Database Connection Details

Your MySQL connection string format:
```
mysql://username:password@hostname:port/database_name
```

Example:
```
mysql://edumanage_user:yourpassword@localhost:3306/edumanage_db
```

## Migration Steps

### Step 1: Install MySQL Driver

```bash
npm install mysql2
```

### Step 2: Update Environment Variables

Create/update `.env` file:
```env
# MySQL Configuration
DATABASE_URL=mysql://username:password@hostname:port/database_name
DB_TYPE=mysql
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-super-secret-session-key
```

### Step 3: Switch to MySQL Schema

The system includes dual database support. To use MySQL:

1. Update `server/db.ts` to use MySQL:
```javascript
// Import MySQL configuration instead of PostgreSQL
import { mysqlDb as db } from './mysql-db';
export { db };
```

2. Update imports in `server/storage.ts`:
```javascript
// Replace PostgreSQL schema import with MySQL schema
import { /* all tables */ } from "../shared/mysql-schema";
```

### Step 4: Generate MySQL Migrations

```bash
# Generate migrations for MySQL
npx drizzle-kit generate --config=drizzle.mysql.config.ts

# Push schema to MySQL database
npx drizzle-kit push --config=drizzle.mysql.config.ts
```

### Step 5: Data Migration (Optional)

If you have existing PostgreSQL data to migrate:

1. **Export PostgreSQL Data:**
```bash
pg_dump --data-only --inserts your_postgres_db > data_export.sql
```

2. **Convert to MySQL Format:**
   - Replace PostgreSQL-specific syntax
   - Convert `SERIAL` to `AUTO_INCREMENT`
   - Adjust data types if needed
   - Handle sequence values

3. **Import to MySQL:**
```bash
mysql -u username -p database_name < converted_data.sql
```

## Key Differences: PostgreSQL vs MySQL

### Data Types
- `SERIAL` → `INT AUTO_INCREMENT`
- `TEXT` → `TEXT` (same)
- `TIMESTAMP` → `TIMESTAMP` (same)
- `DECIMAL(p,s)` → `DECIMAL(p,s)` (same)

### SQL Syntax
- PostgreSQL uses `$1, $2` parameters
- MySQL uses `?` parameters
- Some functions may differ

### Auto-increment Handling
- PostgreSQL: `SERIAL` with sequences
- MySQL: `AUTO_INCREMENT` attribute

## Configuration Files

### MySQL Drizzle Config
File: `drizzle.mysql.config.ts`
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations-mysql",
  schema: "./shared/mysql-schema.ts", 
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
```

### Database Connection
File: `server/mysql-db.ts`
```typescript
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL!,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export const mysqlDb = drizzle(connection);
```

## Deployment on Hostinger

### 1. Upload Files
Upload these files to your Hostinger hosting:
- All application files
- `shared/mysql-schema.ts`
- `server/mysql-db.ts`
- `drizzle.mysql.config.ts`
- Updated `.env` with MySQL connection

### 2. Install Dependencies
```bash
npm install
npm install mysql2  # Ensure MySQL driver is installed
```

### 3. Initialize Database
```bash
# Push schema to create tables
npx drizzle-kit push --config=drizzle.mysql.config.ts

# Verify tables were created
mysql -u username -p -e "SHOW TABLES;" database_name
```

### 4. Start Application
```bash
# Test the connection first
node -e "
const { testMySQLConnection } = require('./server/mysql-db.ts');
testMySQLConnection().then(console.log);
"

# Start the application
npm run build
node dist/index.js
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check MySQL service is running
   - Verify connection string format
   - Ensure proper credentials

2. **SSL/TLS Issues**
   - Add `ssl: { rejectUnauthorized: false }` for self-signed certificates
   - Check if Hostinger requires SSL

3. **Character Set Issues**
   - Ensure database uses UTF8 charset
   - Set `charset: 'utf8mb4'` in connection config

4. **Timeout Issues**
   - Increase connection timeout values
   - Check network connectivity

### Verification Commands

```bash
# Test MySQL connection
mysql -u username -p -h hostname database_name

# Check tables exist
SHOW TABLES;

# Verify data structure
DESCRIBE users;

# Check application logs
tail -f logs/combined.log
```

## Performance Optimizations for MySQL

### Database Configuration
```sql
-- Add indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_assignments_section ON teacher_assignments(section_id);

-- Optimize table settings
ALTER TABLE users ENGINE=InnoDB;
ALTER TABLE messages ENGINE=InnoDB;
```

### Connection Pool Settings
```javascript
const connection = mysql.createPool({
  uri: process.env.DATABASE_URL!,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});
```

## Backup and Maintenance

### Regular Backups
```bash
# Create backup
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# Restore backup
mysql -u username -p database_name < backup_file.sql
```

### Monitoring
- Monitor connection pool usage
- Check slow query logs
- Monitor disk space for database growth

## Security Considerations

1. **Use strong database passwords**
2. **Limit database user permissions**
3. **Enable SSL for production**
4. **Regular security updates**
5. **Monitor access logs**

Your EduManage system is now ready for MySQL deployment on Hostinger!