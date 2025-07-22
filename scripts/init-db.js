
const { initializeDatabase } = require('../lib/database');

async function main() {
  try {
    console.log('Initializing Wilson M&V Intelligence database...');
    await initializeDatabase();
    console.log('Database initialization completed successfully!');
    console.log('The following tables were created:');
    console.log('- chat_sessions: Stores user session information');
    console.log('- chat_messages: Stores all chat messages');
    console.log('- usage_analytics: Stores aggregated usage statistics');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

main();
