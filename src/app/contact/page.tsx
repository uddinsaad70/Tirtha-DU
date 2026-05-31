import type { Metadata } from "next";
import ContactClient from "./_components/ContactClient";

export const metadata: Metadata = {
  title: "যোগাযোগ",
  description:
    "যেকোনো প্রশ্ন, মতামত বা সহায়তার জন্য তীর্থের সাথে যোগাযোগ করুন।",
};

export default function ContactPage() {
  return <ContactClient />;
}
