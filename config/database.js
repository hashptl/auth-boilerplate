const mongoose = require('mongoose');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  port: 27017,
  dbName: 'your-database-name',
  user: 'your-username', // Optional if authentication is not required
  user: 'testuser',
  password: 'your-password' // Optional if authentication is not required
};

// MongoDB connection string
const getMongoDBConnectionString = () => {
  let connectionString = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;

  if (dbConfig.user && dbConfig.password) {
    connectionString = `mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;
  }

  return connectionString;
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const connectionString = getMongoDBConnectionString();
    await mongoose.connect(connectionString, {
      useNewUrlParser: false,
      useUnifiedTopology: false
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = { connectDB };
