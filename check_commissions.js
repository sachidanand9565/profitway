const mysql = require('mysql2/promise');

async function checkCommissions() {
  const connection = await mysql.createConnection({
    host: '68.178.149.177',
    user: 'pro_test',
    password: 'GpX=Dh;McdbL',
    database: 'pro_test',
    port: 3306
  });

  try {
    console.log('=== COMMISSION SYSTEM CHECK ===\n');

    // Check all commission statuses
    const [commissionStatuses] = await connection.execute(
      'SELECT status, COUNT(*) as count, SUM(commission_amount) as total FROM commissions GROUP BY status'
    );
    console.log('Commission statuses:', commissionStatuses);

    // Check recent commissions
    const [recentCommissions] = await connection.execute(
      'SELECT id, earner_user_id, commission_amount, status, created_at FROM commissions ORDER BY created_at DESC LIMIT 10'
    );
    console.log('\nRecent commissions:', recentCommissions);

    // Check if there are any pending commissions that should be credited
    const [pendingCommissions] = await connection.execute(
      'SELECT COUNT(*) as count FROM commissions WHERE status != "credited"'
    );
    console.log('\nPending commissions count:', pendingCommissions[0].count);

    // Check wallet vs commission totals for a sample user
    if (recentCommissions.length > 0) {
      const userId = recentCommissions[0].earner_user_id;
      console.log(`\n=== CHECKING USER ${userId} ===`);

      // Get wallet data
      const [walletData] = await connection.execute('SELECT * FROM user_wallets WHERE user_id = ?', [userId]);
      console.log('Wallet data:', walletData[0]);

      // Get credited commissions total
      const [creditedTotal] = await connection.execute(
        'SELECT SUM(commission_amount) as total FROM commissions WHERE earner_user_id = ? AND status = "credited"',
        [userId]
      );
      console.log('Total credited commissions:', creditedTotal[0].total);

      // Get all commissions for this user
      const [allCommissions] = await connection.execute(
        'SELECT status, SUM(commission_amount) as total FROM commissions WHERE earner_user_id = ? GROUP BY status',
        [userId]
      );
      console.log('All commissions by status:', allCommissions);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkCommissions();
