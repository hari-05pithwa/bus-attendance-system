import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";
import { Toaster } from "sonner";

// Setting up a modern, clean font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bus Portal | BAPS Shahibaug",
  description: "Internal attendance management system",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F8FAFC] text-slate-900 antialiased`}>
        <AuthProvider>
          {children}
          {/* position="top-center" is best for mobile 
              expand={false} keeps it minimalist
          */}
          <Toaster 
            position="bottom-center" 
            richColors 
            closeButton
            toastOptions={{
              style: { borderRadius: '18px' },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}