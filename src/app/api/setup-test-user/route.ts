import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST() {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if test user already exists
    const existingUser = await usersCollection.findOne({
      email: 'talentedhand10@gmail.com'
    });

    if (existingUser) {
      return NextResponse.json({
        message: 'Test user already exists',
        user: {
          email: existingUser.email,
          name: existingUser.name,
          createdAt: existingUser.createdAt
        }
      });
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

    return NextResponse.json({
      message: 'Test user created successfully',
      user: {
        id: result.insertedId,
        email: testUser.email,
        name: testUser.name,
        createdAt: testUser.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json(
      { error: 'Failed to create test user' },
      { status: 500 }
    );
  }
}