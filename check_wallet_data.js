const mysql = require('mysql2/promise');

async function checkWalletData() {
  const connection = await mysql.createConnection({
    host: '68.178.149.177',
    user: 'pro_test',
    password: 'GpX=Dh;McdbL',
    database: 'pro_test',
    port: 3306
  });

  try {
    console.log('=== WALLET DATA CHECK ===\n');

    // Check if user_wallets table exists and has data
    const [wallets] = await connection.execute('SELECT COUNT(*) as count FROM user_wallets');
    console.log('Total wallet records:', wallets[0].count);

    // Check if commissions table exists and has data
    const [commissions] = await connection.execute('SELECT COUNT(*) as count FROM commissions');
    console.log('Total commission records:', commissions[0].count);

    // Check sample users
    const [users] = await connection.execute('SELECT id, username FROM users LIMIT 5');
    console.log('\nSample users:', users.map(u => ({ id: u.id, username: u.username })));

    if (users.length > 0) {
      console.log('\n=== CHECKING FIRST USER ===');
      const userId = users[0].id;

      // Check wallet data
      const [walletData] = await connection.execute('SELECT * FROM user_wallets WHERE user_id = ?', [userId]);
      console.log('Wallet data:', walletData[0] || 'No wallet data found');

      // Check commission data
      const [commissionData] = await connection.execute(
        'SELECT COUNT(*) as count, SUM(commission_amount) as total FROM commissions WHERE earner_user_id = ? AND status = "credited"',
        [userId]
      );
      console.log('Commission data:', commissionData[0]);

      // Check all commission statuses
      const [allCommissions] = await connection.execute(
        'SELECT status, COUNT(*) as count FROM commissions WHERE earner_user_id = ? GROUP BY status',
        [userId]
      );
      console.log('Commission statuses:', allCommissions);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkWalletData();
