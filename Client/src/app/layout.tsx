import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CommonLayout from "@/components/layout/commonLayout";
// Removed Toaster import

export const metadata = {
  title: "KTS - Knowledge & Tech Store",
  description: "Campus IT services and tech store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <main className="flex-1">
          <CommonLayout>{children}</CommonLayout>
        </main>
      </body>
    </html>
  );
}
