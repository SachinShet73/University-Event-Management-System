// src/lib/db.ts
import sql from 'mssql'

const config: sql.config = {
    server: process.env.DB_SERVER || 'SEROSH',
    database: process.env.DB_NAME || 'UniversityEventManagementSystem',
    user: process.env.DB_USER || 'Sachina',
    password: process.env.DB_PASSWORD || 'Sachina',
    options: {
        trustServerCertificate: true,
        encrypt: false,
        enableArithAbort: true
    },
    pool: {
        min: 2,
        max: 10,
        idleTimeoutMillis: 30000
    },
    port: 1433,
    connectionTimeout: 30000,
    requestTimeout: 30000
}

let pool: sql.ConnectionPool | null = null;

export async function executeQuery(query: string, params?: (string | number | null)[]) {
    try {
        if (!pool) {
            pool = await new sql.ConnectionPool(config).connect();
            console.log('Connected to database:', config.database);
        }

        const request = pool.request();

        // Add parameters if they exist
        if (params) {
            params.forEach((param, index) => {
                // Handle different types of parameters
                if (param === null) {
                    request.input(`param${index}`, sql.VarChar, null);
                } else if (typeof param === 'number') {
                    request.input(`param${index}`, sql.Int, param);
                } else {
                    request.input(`param${index}`, sql.VarChar, param);
                }
            });
        }

        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Handle cleanup on application shutdown
process.on('SIGTERM', async () => {
    try {
        if (pool) {
            await pool.close();
            pool = null;
        }
    } catch (error) {
        console.error('Error closing pool:', error);
    }
});

// Handle cleanup on application exit
process.on('exit', async () => {
    try {
        if (pool) {
            await pool.close();
            pool = null;
        }
    } catch (error) {
        console.error('Error closing pool:', error);
    }
});