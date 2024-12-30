import sql from 'mssql'

const config = {
    server: 'SEROSH',  // Default instance
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

// Create a connection pool
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

export async function executeQuery(query: string, params?: any[]) {
    try {
        const pool = await poolPromise
        const request = pool.request()
        console.log('Executing query:', query)
        const result = await request.query(query)
        return result.recordset
    } catch (error) {
        console.error('Database query error:', error)
        throw error
    }
}