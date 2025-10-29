import { prisma } from './db';
import crypto from 'crypto';

export async function generateVerificationToken(userId: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Delete any existing tokens for this user
  await prisma.verificationToken.deleteMany({
    where: { userId },
  });

  // Create new token
  await prisma.verificationToken.create({
    data: {
      identifier: userId,
      token,
      expires,
      userId,
    },
  });

  return token;
}

export async function verifyToken(token: string) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!verificationToken) {
    return null;
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { id: verificationToken.token },
    });
    return null;
  }

  // Update user emailVerified
  await prisma.user.update({
    where: { id: verificationToken.userId },
    data: { emailVerified: new Date() },
  });

  // Delete token
  await prisma.verificationToken.delete({
    where: { token },
  });

  return verificationToken.user;
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
  
  // In production, use a proper email service (Resend, SendGrid, etc.)
  // For now, log the URL (you can replace this with actual email sending)
  console.log(`Verification email for ${email}: ${verificationUrl}`);
  
  // TODO: Replace with actual email service
  // await resend.emails.send({
  //   from: process.env.EMAIL_FROM!,
  //   to: email,
  //   subject: 'Verify your email - SoCal OpenRoster',
  //   html: `Click here to verify: <a href="${verificationUrl}">${verificationUrl}</a>`,
  // });
}

