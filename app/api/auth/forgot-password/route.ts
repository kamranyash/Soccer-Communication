import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists (security best practice)
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

    // Store reset token (you'll need to add a resetToken field to User model or use a separate table)
    // For now, we'll use the VerificationToken table
    await prisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: email,
          token: resetToken,
        },
      },
      update: {
        token: resetToken,
        expires,
      },
      create: {
        identifier: email,
        token: resetToken,
        expires,
        userId: user.id,
      },
    });

    // Send reset email
    const baseUrl = process.env.NEXTAUTH_URL || 'https://socal-or.org';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetUrl);

    return NextResponse.json({
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
  } catch (error) {
    console.error('Error sending password reset:', error);
    return NextResponse.json(
      { error: 'Failed to send reset email' },
      { status: 500 }
    );
  }
}

