"use server";

import { Resend } from "resend";

// ─── Return type consumed by useActionState in ContactClient ─────────────────

export type ContactActionState = {
  status: "idle" | "success" | "error";
  error: string | null;
};

// ─── Resend client — instantiated once, reused across invocations ─────────────
// RESEND_API_KEY is set in .env.local — never exposed to the client bundle

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Server Action ────────────────────────────────────────────────────────────

export async function sendContactMessage(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  // Extract and sanitise form fields
  const name = formData.get("name")?.toString().trim() ?? "";
  const contact = formData.get("contact")?.toString().trim() ?? "";
  const message = formData.get("message")?.toString().trim() ?? "";

  // Basic server-side validation — always validate on the server even if
  // the client already has required attributes on the inputs
  if (!name || name.length < 2) {
    return { status: "error", error: "নাম কমপক্ষে ২ অক্ষরের হতে হবে।" };
  }
  if (!contact) {
    return { status: "error", error: "ইমেইল বা ফোন নম্বর দেওয়া আবশ্যক।" };
  }
  if (!message || message.length < 10) {
    return { status: "error", error: "বার্তাটি কমপক্ষে ১০ অক্ষরের হতে হবে।" };
  }

  try {
    const { error } = await resend.emails.send({
      // 'from' must be a verified domain in your Resend account.
      // During development you can use: onboarding@resend.dev
      from: "তীর্থ ওয়েবসাইট <noreply@tirthadu.org>",
      to: ["info@tirthadu.org"], // your receiving inbox
      replyTo: contact.includes("@") ? contact : undefined,
      subject: `[তীর্থ] নতুন বার্তা — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #0a1628; padding: 20px 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color: #c9a84c; margin: 0; font-size: 18px;">তীর্থ — নতুন যোগাযোগ বার্তা</h2>
          </div>
          <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6b7280; width: 120px; vertical-align: top;">
                  <strong>নাম:</strong>
                </td>
                <td style="padding: 8px 0; font-size: 14px; color: #0a1628;">
                  ${name}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6b7280; vertical-align: top;">
                  <strong>যোগাযোগ:</strong>
                </td>
                <td style="padding: 8px 0; font-size: 14px; color: #0a1628;">
                  ${contact}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6b7280; vertical-align: top;">
                  <strong>বার্তা:</strong>
                </td>
                <td style="padding: 8px 0; font-size: 14px; color: #0a1628; white-space: pre-wrap; line-height: 1.6;">
                  ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                </td>
              </tr>
            </table>
          </div>
          <p style="font-size: 11px; color: #9ca3af; margin-top: 16px; text-align: center;">
            তীর্থ ওয়েবসাইটের যোগাযোগ ফর্ম থেকে পাঠানো হয়েছে।
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API error:", error.message);
      return {
        status: "error",
        error: "বার্তা পাঠাতে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।",
      };
    }

    return { status: "success", error: null };
  } catch (err) {
    console.error("Unexpected contact form error:", err);
    return {
      status: "error",
      error: "একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    };
  }
}
