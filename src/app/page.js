"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Bus,
  Loader2,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

// Updated list with Master Admin
const BUS_LIST = [
  { label: "Master Admin", value: "0" },
  { label: "1.1", value: "1.1" },
  { label: "2.1", value: "2.1" },
  { label: "2.2", value: "2.2" },
  { label: "3.1", value: "3.1" },
];

export default function LoginPage() {
  const [busId, setBusId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedBusId = localStorage.getItem("remembered_bus_id");
    if (savedBusId) setBusId(savedBusId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!busId || !password.trim()) {
      toast.error("Required", {
        description: "Please select Bus ID and enter Vehicle Number!",
      });
      return;
    }
    setIsSubmitting(true);
    const res = await signIn("credentials", {
      email: busId,
      password: password,
      redirect: false,
    });

    if (res.ok) {
      localStorage.setItem("remembered_bus_id", busId);
      toast.success("Login Successful!");
      router.push("/dashboard");
    } else {
      toast.error("Access Denied", { description: "Incorrect credentials." });
      setIsSubmitting(false);
    }
  };

  return (
    /* h-[100dvh] ensures it fits perfectly on mobile screens without scrolling */
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center bg-[#F8FAFC] px-6 overflow-hidden">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-indigo-200">
            <Lock className="text-white" size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Bus Portal
          </h1>
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">
            Mission 92
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Bus ID Dropdown */}
            <div className="group space-y-1">
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">
                Bus ID
              </label>
              <div className="relative flex items-center">
                <Bus
                  size={20}
                  className="absolute left-4 text-slate-400 z-10"
                />
                <select
                  value={busId}
                  onChange={(e) => setBusId(e.target.value)}
                  className="w-full h-14 pl-12 pr-10 bg-white border-2 border-slate-100 rounded-2xl outline-none text-base font-bold text-slate-900 appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select Bus
                  </option>
                  {BUS_LIST.map((bus) => (
                    <option key={bus.value} value={bus.value}>
                      {bus.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-4 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Vehicle Number (Password) */}
            <div className="group space-y-1">
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">
                Vehicle Number
                Password
              </label>
              <div className="relative flex items-center">
                <Lock
                  size={20}
                  className="absolute left-4 text-slate-400 group-focus-within:text-indigo-600"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  className="w-full h-14 pl-12 pr-12 bg-white border-2 border-slate-100 rounded-2xl outline-none text-base font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Grey eye icon without hover colors */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 flex items-center justify-center bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-xl active:scale-[0.97] transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <div className="flex items-center gap-2">
                <span>LOGIN</span>
                <ArrowRight size={22} strokeWidth={3} />
              </div>
            )}
          </button>
        </form>
      </div>

      <footer className="absolute bottom-6 w-full text-center px-6">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          Developed by{" "}
          <span className="text-slate-400 font-black">Harikrishna Pithwa</span>
        </p>
      </footer>
    </div>
  );
}
