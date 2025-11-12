const mysql = require('mysql2/promise');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: '68.178.149.177',
    user: 'pro_test',
    password: 'GpX=Dh;McdbL',
    database: 'pro_test'
  });

  try {
    // Create packages_content table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS packages_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        package_id INT NOT NULL,
        video VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
        INDEX idx_package_id (package_id)
      )
    `);
    console.log('packages_content table created successfully');
  } catch (err) {
    console.log('Error:', err.message);
  } finally {
    await connection.end();
  }
}

runMigration();
