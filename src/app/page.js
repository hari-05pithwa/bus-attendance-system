// "use client";
// import { useState, useEffect } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff, Lock, User, Loader2, ArrowRight } from "lucide-react";
// import { toast } from "sonner";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();

//   // Load email from localStorage on mount
//   useEffect(() => {
//     const savedEmail = localStorage.getItem("remembered_email");
//     if (savedEmail) {
//       setEmail(savedEmail);
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email.trim() || !password.trim()) {
//       toast.error("Required", { description: "Please fill all fields!" });
//       return;
//     }

//     setIsSubmitting(true);

//     const res = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (res.ok) {
//       // Store email in localStorage upon success
//       localStorage.setItem("remembered_email", email);
      
//       toast.success("Welcome back!");
//       router.push("/dashboard");
//     } else {
//       toast.error("Access Denied", {
//         description: "Invalid email or password. Please try again.",
//       });
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
//       <div className="w-full max-w-sm space-y-10">
//         <div className="text-center space-y-3">
//           <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-indigo-200">
//             <Lock className="text-white" size={30} strokeWidth={2.5} />
//           </div>
//           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bus Portal Login</h1>
//         </div>

//         <form className="space-y-6" onSubmit={handleSubmit} noValidate>
//           <div className="space-y-4">
//             <div className="group space-y-1">
//               <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Admin Identity</label>
//               <div className="relative flex items-center">
//                 <User size={20} className="absolute left-4 text-slate-400 group-focus-within:text-indigo-600" />
//                 <input
//                   type="text"
//                   inputMode="email"
//                   placeholder="admin@bus.com"
//                   value={email}
//                   className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-100 rounded-2xl outline-none text-base font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all"
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="group space-y-1">
//               <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Secret Key</label>
//               <div className="relative flex items-center">
//                 <Lock size={20} className="absolute left-4 text-slate-400 group-focus-within:text-indigo-600" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   value={password}
//                   className="w-full h-14 pl-12 pr-12 bg-white border-2 border-slate-100 rounded-2xl outline-none text-base font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all"
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-300 hover:text-indigo-600 transition-colors">
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full h-14 flex items-center justify-center bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-xl active:scale-[0.97] transition-all disabled:opacity-50"
//           >
//             {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <div className="flex items-center gap-2"><span>LOGIN</span><ArrowRight size={22} strokeWidth={3} /></div>}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Bus, Loader2, ArrowRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";

// Simplified Bus List as requested
const BUS_LIST = [
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

  // Load previously used Bus ID from localStorage on mount
  useEffect(() => {
    const savedBusId = localStorage.getItem("remembered_bus_id");
    if (savedBusId) {
      setBusId(savedBusId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!busId || !password.trim()) {
      toast.error("Required", { description: "Please select Bus ID and enter Vehicle Number!" });
      return;
    }

    setIsSubmitting(true);

    // Note: 'email' field in NextAuth is mapped to our 'busId' value
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
      toast.error("Access Denied", {
        description: "Incorrect credentials. Please check your Bus ID and Password.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-indigo-200">
            <Lock className="text-white" size={30} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bus Portal</h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Shahibaug</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Bus ID Dropdown */}
            <div className="group space-y-1">
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">
                Bus ID
              </label>
              <div className="relative flex items-center">
                <Bus size={20} className="absolute left-4 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none z-10" />
                <select
                  value={busId}
                  onChange={(e) => setBusId(e.target.value)}
                  className="w-full h-14 pl-12 pr-10 bg-white border-2 border-slate-100 rounded-2xl outline-none text-base font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Bus</option>
                  {BUS_LIST.map((bus) => (
                    <option key={bus.value} value={bus.value}>
                      Bus {bus.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Password (Vehicle Number) */}
            <div className="group space-y-1">
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">
                Vehicle Number
              </label>
              <div className="relative flex items-center">
                <Lock size={20} className="absolute left-4 text-slate-400 group-focus-within:text-indigo-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter last 4 digits"
                  value={password}
                  className="w-full h-14 pl-12 pr-12 bg-white border-2 border-slate-100 rounded-2xl outline-none text-base font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 text-slate-300 hover:text-indigo-600 transition-colors"
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
    </div>
  );
}