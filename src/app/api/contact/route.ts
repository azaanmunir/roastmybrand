import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { name, email, message } = body as { name: string; email: string; message: string };

  try {
    await resend.emails.send({
      from: "RoastMyBrand <onboarding@resend.dev>",
      to: "azaanmunirpk@gmail.com",
      replyTo: email,
      subject: `New message from ${name} — RoastMyBrand.wtf`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #1A1A1A;">
          <p style="font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #9B9B9B; margin-bottom: 24px;">New contact from RoastMyBrand.wtf</p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F0F0F0; font-size: 13px; color: #9B9B9B; width: 80px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F0F0F0; font-size: 14px; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F0F0F0; font-size: 13px; color: #9B9B9B;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F0F0F0; font-size: 14px;"><a href="mailto:${email}" style="color: #0071E3;">${email}</a></td>
            </tr>
          </table>

          <div style="background: #F7F7F5; border-radius: 10px; padding: 16px 20px; margin-bottom: 28px;">
            <p style="font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #9B9B9B; margin-bottom: 10px;">Message</p>
            <p style="font-size: 14px; line-height: 1.7; color: #1A1A1A; white-space: pre-wrap; margin: 0;">${message}</p>
          </div>

          <a href="mailto:${email}?subject=Re: Your message on RoastMyBrand.wtf" style="display: inline-block; background: #0071E3; color: white; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 8px; text-decoration: none;">Reply to ${name}</a>

          <p style="font-size: 11px; color: #C0C0C0; margin-top: 32px; border-top: 1px solid #F0F0F0; padding-top: 16px;">roastmybrand.wtf</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/contact] Email failed:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
