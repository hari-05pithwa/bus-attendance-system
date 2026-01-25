"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  ClipboardCheck,
  BarChart3,
  LogOut,
  Bus,
  UserCircle2,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Show an immediate loading toast in the center
    toast.loading("Logging out...", {
      id: "logout-toast",
      position: "top-center",
    });

    // Execute sign out and redirect to home
    await signOut({ callbackUrl: "/" });
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* Top Navigation - Minimalist */}
      <nav className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Bus size={20} className="text-white" />
          </div>
          <span className="font-black text-lg tracking-tight uppercase">
            Attendance Portal
          </span>
        </div>
        
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl active:bg-rose-50 active:text-rose-500 transition-all hover:bg-slate-100 disabled:opacity-50"
          aria-label="Logout"
        >
          {isLoggingOut ? (
            <Loader2 size={20} className="animate-spin text-indigo-600" />
          ) : (
            <LogOut size={20} />
          )}
        </button>
      </nav>

      <main className="flex-1 px-6 pt-2 pb-10 space-y-8">
        {/* Welcome Header */}
        <header className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Hi, {session.user.name.split(" ")[0]}
          </h1>
          <div className="flex items-center gap-2">
            <div className="bg-indigo-50 px-3 py-2 rounded-md">
              <span className="text-[12px] font-black text-indigo-600 uppercase tracking-widest">
                {session.user.busId}
              </span>
            </div>
            <div className="bg-slate-50 px-3 py-2 rounded-md flex items-center gap-1">
              <UserCircle2 size={12} className="text-slate-400" />
              <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">
                {session.user.section}
              </span>
            </div>
          </div>
        </header>

        {/* Action Selection */}
        <div className="space-y-5">
          {/* Attendance Card - Deep Indigo */}
          <Link href="/dashboard/attendance" className="block group">
            <div className="relative overflow-hidden bg-slate-900 p-8 rounded-[38px] transition-all active:scale-[0.96] shadow-2xl shadow-slate-200">
              {/* Abstract Background Icon */}
              <div className="absolute -right-10 -bottom-10 text-white/[0.03] rotate-12 transition-transform group-hover:scale-110">
                <ClipboardCheck size={200} />
              </div>
              
              <div className="relative flex flex-col gap-12">
                <div className="h-14 w-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-110">
                  <ClipboardCheck className="text-white" size={28} />
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Attendance</h2>
                    <p className="text-indigo-300/60 text-[11px] font-black uppercase tracking-[1px] mt-1">Start Marking List</p>
                  </div>
                  <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Tally Card - Deep Emerald */}
          <Link href="/dashboard/tally" className="block group">
            <div className="relative overflow-hidden bg-[#064e3b] p-8 rounded-[38px] transition-all active:scale-[0.96] shadow-2xl shadow-emerald-900/10">
              {/* Abstract Background Icon */}
              <div className="absolute -right-10 -bottom-10 text-white/[0.03] -rotate-12 transition-transform group-hover:scale-110">
                <BarChart3 size={200} />
              </div>
              
              <div className="relative flex flex-col gap-12">
                <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-110">
                  <BarChart3 className="text-white" size={28} />
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">View Tally</h2>
                    <p className="text-emerald-300/60 text-[11px] font-black uppercase tracking-[1px] mt-1">Attendance Summary</p>
                  </div>
                  <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>

  
    </div>
  );
}