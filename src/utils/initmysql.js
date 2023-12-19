const mysql = require('mysql2/promise');
require('dotenv').config();


// Function to initialize MySQL connection
let connection;

const initMySQL = async () => {
    if (!connection) {
        connection = await mysql.createConnection(
            {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            }
        );
    }
};

const getConnection = () => {
    if (!connection) {
        throw new Error("Database connection has not been initialized");
    }
    return connection;
}


module.exports = {
    initMySQL,
    getConnection
};