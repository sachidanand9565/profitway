const mysql = require('mysql2/promise');

async function createWalletRecords() {
  const connection = await mysql.createConnection({
    host: '68.178.149.177',
    user: 'pro_test',
    password: 'GpX=Dh;McdbL',
    database: 'pro_test',
    port: 3306
  });

  try {
    console.log('=== CREATING WALLET RECORDS FOR EXISTING USERS ===\n');

    // Get all users who don't have wallet records
    const [usersWithoutWallets] = await connection.execute(`
      SELECT u.id, u.username
      FROM users u
      LEFT JOIN user_wallets w ON u.id = w.user_id
      WHERE w.user_id IS NULL
    `);

    console.log(`Found ${usersWithoutWallets.length} users without wallet records`);

    if (usersWithoutWallets.length > 0) {
      // Create wallet records for users without wallets
      for (const user of usersWithoutWallets) {
        await connection.execute(
          'INSERT INTO user_wallets (user_id, balance, total_earned, total_withdrawn) VALUES (?, 0.00, 0.00, 0.00)',
          [user.id]
        );
        console.log(`Created wallet record for user: ${user.username} (ID: ${user.id})`);
      }

      console.log(`\n✅ Successfully created ${usersWithoutWallets.length} wallet records`);
    } else {
      console.log('All users already have wallet records');
    }

    // Verify wallet records were created
    const [walletCount] = await connection.execute('SELECT COUNT(*) as count FROM user_wallets');
    console.log(`\nTotal wallet records in database: ${walletCount[0].count}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

createWalletRecords();
