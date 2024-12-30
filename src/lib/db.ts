// src/lib/db.ts
import sql from 'mssql'

const config = {
    server: 'SEROSH',
    database: 'UniversityEventManagementSystem',
    user: 'Sachina',
    password: 'Sachina',
    options: {
        trustServerCertificate: true,
        encrypt: false,
        enableArithAbort: true
    },
    port: 1433,
    connectionTimeout: 30000,
    requestTimeout: 30000
}

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to database')
        return pool
    })
    .catch(err => {
        console.log('Database Connection Failed:', err)
        throw err
    })

export async function executeQuery(query: string, params?: (string | number)[]) {
    try {
        const pool = await poolPromise
        const request = pool.request()

        // Add parameters if they exist
        if (params) {
            params.forEach((param, index) => {
                request.input(`param${index}`, param)
            })
        }

        console.log('Executing query:', query)
        const result = await request.query(query)
        return result.recordset
    } catch (error) {
        console.error('Database query error:', error)
        throw error
    }
}