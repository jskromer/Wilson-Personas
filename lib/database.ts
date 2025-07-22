
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test database connection
export async function testDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL not configured. Please set up PostgreSQL database.');
    return false;
  }
  
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Database schema initialization
export async function initializeDatabase() {
  // Check if database is available first
  const isConnected = await testDatabaseConnection();
  if (!isConnected) {
    console.log('Skipping database initialization - no database connection');
    return false;
  }

  const client = await pool.connect();
  try {
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        persona VARCHAR(100),
        region VARCHAR(100),
        language VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        message_count INTEGER DEFAULT 0
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) REFERENCES chat_sessions(session_id),
        role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        response_time_ms INTEGER,
        token_count INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS usage_analytics (
        id SERIAL PRIMARY KEY,
        date DATE DEFAULT CURRENT_DATE,
        total_sessions INTEGER DEFAULT 0,
        total_messages INTEGER DEFAULT 0,
        avg_session_duration REAL DEFAULT 0,
        top_persona VARCHAR(100),
        top_region VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON chat_sessions(created_at);
      CREATE INDEX IF NOT EXISTS idx_messages_session_id ON chat_messages(session_id);
      CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON chat_messages(timestamp);
    `);

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  } finally {
    client.release();
  }
}

// Chat session operations
export async function createChatSession(sessionId: string, persona: string, region: string, language: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO chat_sessions (session_id, persona, region, language) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (session_id) DO UPDATE SET 
       last_activity = CURRENT_TIMESTAMP
       RETURNING *`,
      [sessionId, persona, region, language]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function saveChatMessage(
  sessionId: string, 
  role: 'user' | 'assistant', 
  content: string, 
  responseTimeMs?: number
) {
  const client = await pool.connect();
  try {
    // Save the message
    const messageResult = await client.query(
      `INSERT INTO chat_messages (session_id, role, content, response_time_ms) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [sessionId, role, content, responseTimeMs]
    );

    // Update session message count and last activity
    await client.query(
      `UPDATE chat_sessions 
       SET message_count = message_count + 1, last_activity = CURRENT_TIMESTAMP 
       WHERE session_id = $1`,
      [sessionId]
    );

    return messageResult.rows[0];
  } finally {
    client.release();
  }
}

export async function getChatHistory(sessionId: string, limit: number = 50) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM chat_messages 
       WHERE session_id = $1 
       ORDER BY timestamp ASC 
       LIMIT $2`,
      [sessionId, limit]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

// Analytics operations
export async function getUsageAnalytics(days: number = 7) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        DATE(s.created_at) as date,
        COUNT(DISTINCT s.session_id) as total_sessions,
        COUNT(m.id) as total_messages,
        AVG(s.message_count) as avg_messages_per_session,
        MODE() WITHIN GROUP (ORDER BY s.persona) as top_persona,
        MODE() WITHIN GROUP (ORDER BY s.region) as top_region
      FROM chat_sessions s
      LEFT JOIN chat_messages m ON s.session_id = m.session_id
      WHERE s.created_at >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY DATE(s.created_at)
      ORDER BY date DESC
    `);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getPopularQueries(limit: number = 10) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        content,
        COUNT(*) as frequency,
        AVG(response_time_ms) as avg_response_time
      FROM chat_messages 
      WHERE role = 'user' 
      AND created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY content
      HAVING COUNT(*) > 1
      ORDER BY frequency DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getSessionStats() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        COUNT(DISTINCT session_id) as total_sessions,
        COUNT(id) as total_messages,
        AVG(message_count) as avg_messages_per_session,
        COUNT(DISTINCT persona) as unique_personas,
        COUNT(DISTINCT region) as unique_regions
      FROM chat_sessions
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export { pool };
