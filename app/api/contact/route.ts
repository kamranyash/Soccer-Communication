import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('[contact] Missing RESEND_API_KEY');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    if (!process.env.EMAIL_FROM) {
      console.error('[contact] Missing EMAIL_FROM');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email to support@socal-or.org
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: 'support@socal-or.org',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    });

    console.log('[contact] Resend response', result);

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error: any) {
    console.error('[contact] Error sending contact email', {
      message: error?.message,
      name: error?.name,
      status: error?.status,
      body: error?.response?.data || error
    });
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

