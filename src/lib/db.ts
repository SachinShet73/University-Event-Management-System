// src/lib/db.ts
import sql from 'mssql'

const isProd = process.env.NODE_ENV === 'production'

const config: sql.config = {
    server: process.env.DB_SERVER || 'SEROSH',
    database: process.env.DB_NAME || 'UniversityEventManagementSystem',
    user: process.env.DB_USER || 'Sachina',
    password: process.env.DB_PASSWORD || 'Sachina',
    options: {
        trustServerCertificate: !isProd, // True for local, false for production
        encrypt: isProd, // Required for Azure/Production
        enableArithAbort: true
    },
    pool: {
        min: 2,
        max: 10,
        idleTimeoutMillis: 30000
    },
    port: parseInt(process.env.DB_PORT || '1433'),
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
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
        }
        throw error;
    }
}

// Add a connection test function
export async function testConnection() {
    try {
        if (!pool) {
            pool = await new sql.ConnectionPool(config).connect();
        }
        const result = await pool.request().query('SELECT 1 as test');
        return result.recordset[0].test === 1;
    } catch (error) {
        console.error('Connection test failed:', error);
        return false;
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