const mysql = require('mysql2/promise');

async function addPasswordColumn() {
  const connection = await mysql.createConnection({
    host: '68.178.149.177',
    user: 'pro_test',
    password: 'GpX=Dh;McdbL',
    database: 'pro_test'
  });

  try {
    await connection.execute("ALTER TABLE checkout ADD COLUMN password VARCHAR(255) DEFAULT NULL");
    console.log('Password column added successfully');
  } catch (err) {
    console.log('Error:', err.message);
  } finally {
    await connection.end();
  }
}

addPasswordColumn();
