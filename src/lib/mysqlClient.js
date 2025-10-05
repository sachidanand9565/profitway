import mysql from 'mysql2/promise';

const {
  MYSQL_HOST = '68.178.149.177',
  MYSQL_USER = 'pro_test',
  MYSQL_PASSWORD = 'GpX=Dh;McdbL',
  MYSQL_DATABASE = 'pro_test',
  MYSQL_PORT = 3306
} = process.env;

// Create connection pools
let poolWithDB;
let poolWithoutDB;

export async function getConnection(database = MYSQL_DATABASE) {
  if (database) {
    if (!poolWithDB) {
      poolWithDB = mysql.createPool({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: database,
        port: MYSQL_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }
    return poolWithDB.getConnection();
  } else {
    if (!poolWithoutDB) {
      poolWithoutDB = mysql.createPool({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        port: MYSQL_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }
    return poolWithoutDB.getConnection();
  }
}

export async function query(sql, params = [], database = MYSQL_DATABASE) {
  const connection = await getConnection(database);
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}
