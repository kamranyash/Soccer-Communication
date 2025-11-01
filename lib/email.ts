import { prisma } from './db';
import crypto from 'crypto';
import { Resend } from 'resend';

export async function generateVerificationToken(userId: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Delete any existing tokens for this user
  await prisma.verificationToken.deleteMany({ where: { userId } });

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

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  console.log('[verify] sendVerificationEmail called', {
    email,
    hasApi: !!process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM,
    nextauthUrl: process.env.NEXTAUTH_URL,
    url: verificationUrl
  });

  if (!process.env.RESEND_API_KEY) {
    console.error('[verify] Missing RESEND_API_KEY');
    throw new Error('Email disabled: missing RESEND_API_KEY');
  }
  if (!process.env.EMAIL_FROM) {
    console.error('[verify] Missing EMAIL_FROM');
    throw new Error('Email disabled: missing EMAIL_FROM');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: 'Verify your email - SoCal OpenRoster',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Verify your email</h2>
          <p>Thanks for signing up for SoCal OpenRoster. Click the button below to verify your email address.</p>
          <p>
            <a href="${verificationUrl}" style="display:inline-block;background:#1A56DB;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
              Verify Email
            </a>
          </p>
          <p>Or copy and paste this link into your browser:<br>
          <a href="${verificationUrl}">${verificationUrl}</a></p>
        </div>
      `,
    });

    console.log('[verify] Resend response', result);
    return result;
  } catch (error: any) {
    console.error('[verify] Error sending verification email', {
      message: error?.message,
      name: error?.name,
      status: error?.status,
      body: error?.response?.data || error
    });
    throw error;
  }
}