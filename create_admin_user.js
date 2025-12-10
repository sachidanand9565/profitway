const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  // Database configuration
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'profitway',
  };

  try {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection(dbConfig);

    // Check if admin user already exists in admin table
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM admin WHERE email = ?',
      ['admin@profitway.com']
    );

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists!');
      await connection.end();
      return;
    }

    // Hash password
    const saltRounds = 10;
    const password = 'admin123'; // Change this to a secure password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert admin user into admin table
    const [result] = await connection.execute(
      'INSERT INTO admin (email, password, created_at) VALUES (?, ?, NOW())',
      ['admin@profitway.com', hashedPassword]
    );

    console.log('Admin user created successfully!');
    console.log('Email: admin@profitway.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login.');

    await connection.end();
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();
