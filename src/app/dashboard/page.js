// "use client";

// import { useSession, signOut } from "next-auth/react";
// import Link from "next/link";
// import { useState } from "react";
// import {
//   ClipboardCheck,
//   BarChart3,
//   LogOut,
//   Bus,
//   UserCircle2,
//   ChevronRight,
//   Loader2,
// } from "lucide-react";
// import { toast } from "sonner";

// export default function Dashboard() {
//   const { data: session } = useSession();
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   const handleLogout = async () => {
//     setIsLoggingOut(true);
    
//     // Show an immediate loading toast in the center
//     toast.loading("Logging out...", {
//       id: "logout-toast",
//       position: "top-center",
//     });

//     // Execute sign out and redirect to home
//     await signOut({ callbackUrl: "/" });
//   };

//   if (!session) return null;

//   return (
//     <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
//       {/* Top Navigation - Minimalist */}
//       <nav className="p-6 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
//             <Bus size={20} className="text-white" />
//           </div>
//           <span className="font-black text-lg tracking-tight uppercase">
//             Attendance Portal
//           </span>
//         </div>
        
//         <button
//           onClick={handleLogout}
//           disabled={isLoggingOut}
//           className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl active:bg-rose-50 active:text-rose-500 transition-all hover:bg-slate-100 disabled:opacity-50"
//           aria-label="Logout"
//         >
//           {isLoggingOut ? (
//             <Loader2 size={20} className="animate-spin text-indigo-600" />
//           ) : (
//             <LogOut size={20} />
//           )}
//         </button>
//       </nav>

//       <main className="flex-1 px-6 pt-2 pb-10 space-y-8">
//         {/* Welcome Header */}
//         <header className="space-y-1">
//           <h1 className="text-4xl font-black tracking-tight text-slate-900">
//             Hi, {session.user.name.split(" ")[0]}
//           </h1>
//           <div className="flex items-center gap-2">
//             <div className="bg-indigo-50 px-3 py-2 rounded-md">
//               <span className="text-[12px] font-black text-indigo-600 uppercase tracking-widest">
//                 {session.user.busId}
//               </span>
//             </div>
//             <div className="bg-slate-50 px-3 py-2 rounded-md flex items-center gap-1">
//               <UserCircle2 size={12} className="text-slate-400" />
//               <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">
//                 {session.user.section}
//               </span>
//             </div>
//           </div>
//         </header>

//         {/* Action Selection */}
//         <div className="space-y-5">
//           {/* Attendance Card - Deep Indigo */}
//           <Link href="/dashboard/attendance" className="block group">
//             <div className="relative overflow-hidden bg-slate-900 p-8 rounded-[38px] transition-all active:scale-[0.96] shadow-2xl shadow-slate-200">
//               {/* Abstract Background Icon */}
//               <div className="absolute -right-10 -bottom-10 text-white/[0.03] rotate-12 transition-transform group-hover:scale-110">
//                 <ClipboardCheck size={200} />
//               </div>
              
//               <div className="relative flex flex-col gap-12">
//                 <div className="h-14 w-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-110">
//                   <ClipboardCheck className="text-white" size={28} />
//                 </div>
                
//                 <div className="flex items-end justify-between">
//                   <div>
//                     <h2 className="text-3xl font-black text-white tracking-tight">Attendance</h2>
//                     <p className="text-indigo-300/60 text-[11px] font-black uppercase tracking-[1px] mt-1">Start Marking List</p>
//                   </div>
//                   <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md">
//                     <ChevronRight size={24} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Link>

//           {/* Tally Card - Deep Emerald */}
//           <Link href="/dashboard/tally" className="block group">
//             <div className="relative overflow-hidden bg-[#064e3b] p-8 rounded-[38px] transition-all active:scale-[0.96] shadow-2xl shadow-emerald-900/10">
//               {/* Abstract Background Icon */}
//               <div className="absolute -right-10 -bottom-10 text-white/[0.03] -rotate-12 transition-transform group-hover:scale-110">
//                 <BarChart3 size={200} />
//               </div>
              
//               <div className="relative flex flex-col gap-12">
//                 <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-110">
//                   <BarChart3 className="text-white" size={28} />
//                 </div>
                
//                 <div className="flex items-end justify-between">
//                   <div>
//                     <h2 className="text-3xl font-black text-white tracking-tight">View Tally</h2>
//                     <p className="text-emerald-300/60 text-[11px] font-black uppercase tracking-[1px] mt-1">Attendance Summary</p>
//                   </div>
//                   <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md">
//                     <ChevronRight size={24} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         </div>
//       </main>

  
//     </div>
//   );
// }



//last
// "use client";

// import { useSession, signOut } from "next-auth/react";
// import Link from "next/link";
// import { useState } from "react";
// import {
//   ClipboardCheck,
//   BarChart3,
//   LogOut,
//   Bus,
//   ChevronRight,
//   Loader2,
//   ShieldCheck,
// } from "lucide-react";
// import { toast } from "sonner";

// export default function Dashboard() {
//   const { data: session, status } = useSession();
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   const handleLogout = async () => {
//     setIsLoggingOut(true);
    
//     toast.loading("Logging out...", {
//       id: "logout-toast",
//       position: "top-center",
//     });

//     await signOut({ callbackUrl: "/" });
//   };

//   // Prevent crash while loading session
//   if (status === "loading") {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <Loader2 className="animate-spin text-indigo-600" size={32} />
//       </div>
//     );
//   }

//   if (!session) return null;

//   // Safe name extraction with fallback
//   const firstName = session.user?.name ? session.user.name.split(" ")[0] : "Admin";

//   return (
//     <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
//       {/* Top Navigation */}
//       <nav className="p-6 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
//             <Bus size={20} className="text-white" />
//           </div>
//           <span className="font-black text-lg tracking-tight uppercase">
//             Portal
//           </span>
//         </div>
        
//         <button
//           onClick={handleLogout}
//           disabled={isLoggingOut}
//           className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl active:bg-rose-50 active:text-rose-500 transition-all hover:bg-slate-100 disabled:opacity-50"
//           aria-label="Logout"
//         >
//           {isLoggingOut ? (
//             <Loader2 size={20} className="animate-spin text-indigo-600" />
//           ) : (
//             <LogOut size={20} />
//           )}
//         </button>
//       </nav>

//       <main className="flex-1 px-6 pt-2 pb-10 space-y-8">
//         {/* Welcome Header */}
//         <header className="space-y-3">
//           <div>
//             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">Welcome back</p>
//             <h1 className="text-4xl font-black tracking-tight text-slate-900">
//               Hi, {firstName}
//             </h1>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <div className="bg-slate-900 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-slate-200">
//               <Bus size={14} className="text-indigo-400" />
//               <span className="text-[12px] font-black text-white uppercase tracking-widest">
//                 Bus {session.user.busId}
//               </span>
//             </div>
//             <div className="bg-indigo-50 px-4 py-2 rounded-full flex items-center gap-2">
//               <ShieldCheck size={14} className="text-indigo-600" />
//               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
//                 Verified Admin
//               </span>
//             </div>
//           </div>
//         </header>

//         {/* Action Selection */}
//         <div className="grid gap-5">
//           {/* Attendance Card - Deep Indigo */}
//           <Link href="/dashboard/attendance" className="block group">
//             <div className="relative overflow-hidden bg-slate-900 p-8 rounded-[38px] transition-all active:scale-[0.96] shadow-2xl shadow-slate-200">
//               <div className="absolute -right-10 -bottom-10 text-white/[0.03] rotate-12 transition-transform group-hover:scale-110">
//                 <ClipboardCheck size={200} />
//               </div>
              
//               <div className="relative flex flex-col gap-12">
//                 <div className="h-14 w-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-110">
//                   <ClipboardCheck className="text-white" size={28} />
//                 </div>
                
//                 <div className="flex items-end justify-between">
//                   <div>
//                     <h2 className="text-3xl font-black text-white tracking-tight">Attendance</h2>
//                     <p className="text-indigo-300/60 text-[11px] font-black uppercase tracking-[1px] mt-1">Start Marking List</p>
//                   </div>
//                   <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md">
//                     <ChevronRight size={24} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Link>

//           {/* Tally Card - Deep Emerald */}
//           <Link href="/dashboard/tally" className="block group">
//             <div className="relative overflow-hidden bg-[#064e3b] p-8 rounded-[38px] transition-all active:scale-[0.96] shadow-2xl shadow-emerald-900/10">
//               <div className="absolute -right-10 -bottom-10 text-white/[0.03] -rotate-12 transition-transform group-hover:scale-110">
//                 <BarChart3 size={200} />
//               </div>
              
//               <div className="relative flex flex-col gap-12">
//                 <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-110">
//                   <BarChart3 className="text-white" size={28} />
//                 </div>
                
//                 <div className="flex items-end justify-between">
//                   <div>
//                     <h2 className="text-3xl font-black text-white tracking-tight">Summary</h2>
//                     <p className="text-emerald-300/60 text-[11px] font-black uppercase tracking-[1px] mt-1">View Final Tally</p>
//                   </div>
//                   <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md">
//                     <ChevronRight size={24} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         </div>
//       </main>

//       <footer className="p-8 text-center">
//         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
//           Developed by <span className="text-slate-400">Harikrishna Pithwa</span>
//         </p>
//       </footer>
//     </div>
//   );
// }
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  ClipboardCheck,
  BarChart3,
  LogOut,
  Bus,
  ChevronRight,
  Loader2,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    toast.loading("Logging out...", {
      id: "logout-toast",
      position: "top-center",
    });
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="h-[100dvh] bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!session) return null;

  const firstName = session.user?.name ? session.user.name.split(" ")[0] : "Admin";
  const isSuperAdmin = session.user?.role === "superadmin";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      {/* Top Navigation */}
      <nav className="p-6 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Bus size={20} className="text-white" />
          </div>
          <span className="font-black text-lg tracking-tight uppercase">Portal</span>
        </div>
        
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="h-10 w-10 flex items-center justify-center bg-white border border-slate-100 text-slate-400 rounded-xl active:bg-rose-50 active:text-rose-500 transition-all disabled:opacity-50 shadow-sm"
        >
          {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
        </button>
      </nav>

      <main className="flex-1 px-6 pt-4 pb-10 space-y-8 max-w-lg mx-auto w-full">
        {/* Welcome Header */}
        <header className="space-y-3">
          <div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">
              {isSuperAdmin ? "System Master" : "Bus Control"}
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Hi, {firstName}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-slate-200">
              <Bus size={14} className="text-indigo-400" />
              <span className="text-[12px] font-black text-white uppercase tracking-widest">
                {isSuperAdmin ? "All Buses" : `Bus ${session.user.busId}`}
              </span>
            </div>
            <div className="bg-indigo-50 px-4 py-2 rounded-full flex items-center gap-2">
              <ShieldCheck size={14} className="text-indigo-600" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                {isSuperAdmin ? "Super Admin" : "Verified Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Action Selection */}
        <div className="grid gap-5">
          {/* 1. MASTER VIEW CARD - ONLY visible if Super Admin */}
          {isSuperAdmin && (
            <Link href="/dashboard/master" className="block group">
              <div className="relative overflow-hidden bg-indigo-600 p-8 rounded-[38px] transition-all active:scale-[0.96] shadow-2xl shadow-indigo-200">
                <div className="absolute -right-10 -bottom-10 text-white/[0.1] rotate-12 transition-transform group-hover:scale-110">
                  <LayoutDashboard size={180} />
                </div>
                <div className="relative flex flex-col gap-10">
                  <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <LayoutDashboard className="text-white" size={28} />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tight">Master View</h2>
                      <p className="text-indigo-100/70 text-[11px] font-black uppercase tracking-[1px] mt-1">View all buses</p>
                    </div>
                    <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md">
                      <ChevronRight size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* 2. REGULAR ADMIN CARDS - Hidden if Super Admin */}
          {!isSuperAdmin && (
            <>
              <Link href="/dashboard/attendance" className="block group">
                <div className="relative overflow-hidden bg-slate-900 p-8 rounded-[38px] transition-all active:scale-[0.96] shadow-2xl shadow-slate-200">
                  <div className="absolute -right-10 -bottom-10 text-white/[0.03] rotate-12">
                    <ClipboardCheck size={200} />
                  </div>
                  <div className="relative flex flex-col gap-10">
                    <div className="h-14 w-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <ClipboardCheck className="text-white" size={28} />
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Attendance</h2>
                        <p className="text-indigo-300/60 text-[11px] font-black uppercase tracking-[1px] mt-1">Mark Present List</p>
                      </div>
                      <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-white">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/tally" className="block group">
                <div className="relative overflow-hidden bg-[#064e3b] p-8 rounded-[38px] transition-all active:scale-[0.96] shadow-2xl shadow-emerald-900/10">
                  <div className="absolute -right-10 -bottom-10 text-white/[0.03] -rotate-12">
                    <BarChart3 size={200} />
                  </div>
                  <div className="relative flex flex-col gap-10">
                    <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <BarChart3 className="text-white" size={28} />
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Summary</h2>
                        <p className="text-emerald-300/60 text-[11px] font-black uppercase tracking-[1px] mt-1">Final Bus Tally</p>
                      </div>
                      <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-white">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>
      </main>

      <footer className="p-8 text-center mt-auto">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          Developed by <span className="text-slate-400 font-black">Harikrishna Pithwa</span>
        </p>
      </footer>
    </div>
  );
}