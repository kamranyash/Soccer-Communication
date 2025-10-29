import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateVerificationToken, sendVerificationEmail } from '@/lib/email';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['PLAYER', 'COACH']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    // Create profile based on role
    if (role === 'PLAYER') {
      await prisma.playerProfile.create({
        data: { userId: user.id },
      });
    } else if (role === 'COACH') {
      await prisma.coachProfile.create({
        data: { userId: user.id },
      });
    }

    // Generate verification token
    const token = await generateVerificationToken(user.id);
    await sendVerificationEmail(email, token);

    return NextResponse.json({
      message: 'User created. Please check your email to verify your account.',
      userId: user.id,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

