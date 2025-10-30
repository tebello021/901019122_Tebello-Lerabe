const mysql = require('mysql2');
require('dotenv').config();

// Using YOUR root user and password
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '57468857',
  database: process.env.DB_NAME || 'attendance_db',
  port: process.env.DB_PORT || 3306,
};

console.log('🔧 Connecting to MySQL with:');
console.log('   User: root');
console.log('   Database: attendance_db');
console.log('   Password: 57468857');

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('❌ DATABASE CONNECTION FAILED:', err.message);
    console.log('💡 Please check:');
    console.log('   1. MySQL server is running');
    console.log('   2. Password is correct: 57468857');
    console.log('   3. attendance_db exists');
  } else {
    console.log('✅ SUCCESS: Connected to MySQL as root user!');
    console.log('✅ Database: attendance_db');
    console.log('✅ Connection ID:', connection.threadId);
  }
});

connection.on('error', (err) => {
  console.error('❌ Database error:', err.message);
});

module.exports = connection;