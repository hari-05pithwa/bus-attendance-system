// import { Inter } from "next/font/google";
// import "./globals.css";
// import { AuthProvider } from "./providers";
// import { Toaster } from "sonner";

// // Setting up a modern, clean font
// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Bus Portal | BAPS Shahibaug",
//   description: "Internal attendance management system",
//   viewport: "width=device-width, initial-scale=1, maximum-scale=1",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-[#F8FAFC] text-slate-900 antialiased`}>
//         <AuthProvider>
//           {children}
//           {/* position="top-center" is best for mobile 
//               expand={false} keeps it minimalist
//           */}
//           <Toaster 
//             position="bottom-center" 
//             richColors 
//             closeButton
//             toastOptions={{
//               style: { borderRadius: '18px' },
//             }}
//           />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";
import { Toaster } from "sonner";
import NextTopLoader from 'nextjs-toploader';

// Setting up a modern, clean font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bus Portal | MSM 92",
  description: "Internal attendance management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F8FAFC] text-slate-900 antialiased`}>
        {/* PROGRESS BAR CONFIGURATION 
          color: #4f46e5 matches your primary Indigo theme
          showSpinner: false keeps the mobile UI clean
        */}
        <NextTopLoader 
          color="#4f46e5"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #4f46e5,0 0 5px #4f46e5"
        />

        <AuthProvider>
          {children}
          
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