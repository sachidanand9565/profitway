const mysql = require('mysql2/promise');

async function alterImageColumn() {
  const connection = await mysql.createConnection({
    host: '68.178.149.177',
    user: 'pro_test',
    password: 'GpX=Dh;McdbL',
    database: 'pro_test'
  });

  try {
    await connection.execute("ALTER TABLE users MODIFY COLUMN image TEXT");
    console.log('Image column altered to TEXT successfully');
  } catch (err) {
    console.log('Error:', err.message);
  } finally {
    await connection.end();
  }
}

alterImageColumn();