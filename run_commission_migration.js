const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigration() {
  let connection;

  try {
    // Database connection config
    const config = {
      host: process.env.MYSQL_HOST || '68.178.149.177',
      user: process.env.MYSQL_USER || 'pro_test',
      password: process.env.MYSQL_PASSWORD || 'GpX=Dh;McdbL',
      database: process.env.MYSQL_DATABASE || 'pro_test',
      port: process.env.MYSQL_PORT || 3306
    };

    console.log('Connecting to database...');
    connection = await mysql.createConnection(config);

    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, 'commission_system_migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('Executing migration...');

    // Split SQL commands and execute them one by one
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 50) + '...');
        await connection.execute(statement);
      }
    }

    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
