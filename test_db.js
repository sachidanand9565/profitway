const mysql = require('mysql2/promise');

async function test() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'profitway'
  });

  try {
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM commissions WHERE status = "credited"');
    console.log('Total credited commissions:', rows[0].count);

    const [rows2] = await connection.execute('SELECT SUM(commission_amount) as total FROM commissions WHERE status = "credited"');
    console.log('Total amount:', rows2[0].total);

    const [rows3] = await connection.execute('SELECT created_at FROM commissions WHERE status = "credited" LIMIT 1');
    console.log('Sample created_at:', rows3[0]?.created_at);

    const today = new Date();
    const todayStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    console.log('todayStart:', todayStart.toISOString());

    const [rows4] = await connection.execute('SELECT SUM(commission_amount) as total FROM commissions WHERE status = "credited" AND created_at >= ?', [todayStart]);
    console.log('Today earnings:', rows4[0].total);

  } catch (error) {
    console.error(error);
  } finally {
    connection.end();
  }
}

test();