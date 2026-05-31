// import type { Metadata } from "next";
// import { Hind_Siliguri } from "next/font/google";
// import "../globals.css";

// const hindSiliguri = Hind_Siliguri({
//   subsets: ["bengali", "latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-hind",
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "অ্যাডমিন লগইন | তীর্থ",
// };

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="bn" className={hindSiliguri.variable}>
//       <body
//         suppressHydrationWarning
//         className="font-sans bg-[#0a1628] text-[#1a1a2e] antialiased"
//       >
//         <main className="min-h-screen">{children}</main>
//       </body>
//     </html>
//   );
// }
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="auth-wrapper">{children}</div>;
}
