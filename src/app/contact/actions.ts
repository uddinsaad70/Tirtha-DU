"use server";

import nodemailer from "nodemailer";

export type ContactActionState = {
  status: "idle" | "success" | "error";
  error: string | null;
};

export async function sendContactMessage(
  prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  // ফর্ম থেকে ডেটা নিচ্ছি
  const name = formData.get("name") as string;
  const contact = formData.get("contact") as string;
  const message = formData.get("message") as string;

  // বেসিক ভ্যালিডেশন
  if (!name || !contact || !message) {
    return {
      status: "error",
      error: "অনুগ্রহ করে ফর্মের সবগুলো ঘর পূরণ করুন।",
    };
  }

  try {
    // Nodemailer ট্রান্সপোর্টার সেটআপ
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // মেইলের অপশন (আপনার নিজের মেইলে মেসেজটি আসবে)
    const mailOptions = {
      from: process.env.EMAIL_USER, // সেন্ডার হিসেবে আপনার মেইলই থাকবে
      to: process.env.EMAIL_USER, // রিসিভার হিসেবেও আপনার মেইল (যাতে আপনি মেসেজটি পান)
      subject: `Tirtho DU: New Message from ${name}`,
      text: `Name: ${name}\nContact: ${contact}\nMessage: ${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0a1628; padding: 20px; text-align: center;">
            <h2 style="color: #c9a84c; margin: 0;">তীর্থ - ঢাকা বিশ্ববিদ্যালয়</h2>
            <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px;">নতুন কন্ট্যাক্ট মেসেজ</p>
          </div>
          <div style="padding: 20px; background-color: #f9fafb;">
            <p style="margin: 0 0 10px 0;"><strong>নাম:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>কন্ট্যাক্ট (Email/Phone):</strong> ${contact}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #374151; white-space: pre-wrap;"><strong>মেসেজ:</strong><br/><br/>${message}</p>
            </div>
          </div>
        </div>
      `,
    };

    // মেইল পাঠানো হচ্ছে
    await transporter.sendMail(mailOptions);

    return {
      status: "success",
      error: null,
    };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return {
      status: "error",
      error: "দুঃখিত, মেসেজ পাঠানো সম্ভব হয়নি। পরে আবার চেষ্টা করুন।",
    };
  }
}
