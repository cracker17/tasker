const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('tasker');
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: 'talentedhand10@gmail.com'
    });

    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('@D3signer101!', 12);

    // Create the test user
    const testUser = {
      name: 'Test User',
      email: 'talentedhand10@gmail.com',
      password: hashedPassword,
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(testUser);
    console.log('Test user created successfully:', result.insertedId);

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createTestUser().catch(console.error);