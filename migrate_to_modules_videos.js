const mysql = require('mysql2/promise');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: '68.178.149.177',
    user: 'pro_test',
    password: 'GpX=Dh;McdbL',
    database: 'pro_test'
  });

  try {
    // Create modules table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS modules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        package_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
        INDEX idx_package_id (package_id),
        INDEX idx_order_index (order_index)
      )
    `);
    console.log('modules table created successfully');

    // Create videos table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        module_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        video_url VARCHAR(500) NOT NULL,
        image VARCHAR(255),
        description TEXT,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
        INDEX idx_module_id (module_id),
        INDEX idx_order_index (order_index)
      )
    `);
    console.log('videos table created successfully');

    // Migrate existing packages_content data to new structure
    // First, create a default module for each package
    await connection.execute(`
      INSERT INTO modules (package_id, title, description, order_index)
      SELECT id, CONCAT(name, ' Module'), 'Default module for existing content', 1
      FROM packages
      WHERE id NOT IN (SELECT DISTINCT package_id FROM modules)
    `);
    console.log('Default modules created for existing packages');

    // Then migrate videos to the new structure
    await connection.execute(`
      INSERT INTO videos (module_id, title, video_url, image, order_index, created_at)
      SELECT m.id, COALESCE(pc.title, CONCAT('Video ', pc.id)), pc.video, pc.image, 1, pc.created_at
      FROM packages_content pc
      JOIN modules m ON m.package_id = pc.package_id
      WHERE pc.id NOT IN (SELECT DISTINCT id FROM videos WHERE module_id = m.id)
    `);
    console.log('Existing videos migrated to new structure');

  } catch (err) {
    console.log('Error:', err.message);
  } finally {
    await connection.end();
  }
}

runMigration();