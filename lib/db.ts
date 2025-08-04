import sql from 'mssql';

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false, // local bağlantılar için genellikle false olur
    trustServerCertificate: true, // self-signed sertifikalar için gerekli
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection() {
  try {
    if (pool) {
      return pool;
    }

    pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}
