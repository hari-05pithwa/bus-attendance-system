// "use client";
// import { useState, useEffect, useMemo } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff, Lock, Loader2, ArrowRight, Bus, MapPin, ShieldCheck, ChevronDown } from "lucide-react";
// import { toast } from "sonner";

// export default function RoleLoginForm({ role, title, colorClass }) {
//   const [apiData, setApiData] = useState([]);
//   const [selectedZone, setSelectedZone] = useState("");
//   const [identifier, setIdentifier] = useState(""); 
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoadingApi, setIsLoadingApi] = useState(role === "admin");
//   const router = useRouter();

//   const Icon = role === "super" ? ShieldCheck : role === "zone" ? MapPin : Bus;

//   // 1. Fetch API data via local proxy to bypass CORS
//   useEffect(() => {
//     if (role === "admin") {
//       fetch("/api/auth/bus-list") // Calls your local proxy
//         .then(res => res.json())
//         .then(json => {
//           if (json.success) setApiData(json.data);
//           setIsLoadingApi(false);
//         })
//         .catch(() => {
//           toast.error("API Error", { description: "Failed to load bus list." });
//           setIsLoadingApi(false);
//         });
//     }
//   }, [role]);

//   // 2. Dropdown Logic
//   const zones = useMemo(() => [...new Set(apiData.map(item => item.zone))].sort(), [apiData]);
  
//   const filteredBusIds = useMemo(() => {
//     if (!selectedZone) return [];
//     return apiData
//       .filter(item => item.zone === selectedZone)
//       .map(item => String(item.busId)) // String casting for Atlas matching
//       .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
//   }, [apiData, selectedZone]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const finalId = role === "admin" ? identifier : identifier.trim();
    
//     if (!finalId || !password.trim()) {
//       toast.error("Required", { description: "Please complete all fields!" });
//       return;
//     }

//     setIsSubmitting(true);
//     const res = await signIn("credentials", {
//       email: finalId,
//       password: password,
//       redirect: false,
//     });

//     if (res?.ok) {
//       toast.success("Login Successful!");
//       router.push(role === 'super' ? "/dashboard/master" : role === 'zone' ? "/dashboard/zone" : "/dashboard");
//     } else {
//       toast.error("Access Denied", { description: "Incorrect credentials." });
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#F8FAFC] px-6">
//       <div className="w-full max-w-sm space-y-6">
//         <button onClick={() => router.push("/")} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors">
//           <ArrowRight className="rotate-180" size={16} /> Back to roles
//         </button>

//         <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 space-y-6">
//           <div className="text-center space-y-1">
//             <div className={`mx-auto w-12 h-12 ${colorClass.replace('bg-', 'text-')} bg-slate-50 rounded-2xl flex items-center justify-center mb-2`}>
//               {isLoadingApi ? <Loader2 className="animate-spin text-indigo-600" /> : <Icon size={24} />}
//             </div>
//             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {role === "admin" ? (
//               <>
//                 <div className="space-y-1">
//                   <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Zone</label>
//                   <div className="relative flex items-center">
//                     <MapPin size={18} className="absolute left-4 text-slate-400" />
//                     <select 
//                       value={selectedZone} 
//                       onChange={(e) => { setSelectedZone(e.target.value); setIdentifier(""); }}
//                       className="w-full h-12 pl-12 pr-10 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900 appearance-none"
//                     >
//                       <option value="">Choose Zone</option>
//                       {zones.map(z => <option key={z} value={z}>{z}</option>)}
//                     </select>
//                     <ChevronDown size={16} className="absolute right-4 text-slate-400 pointer-events-none" />
//                   </div>
//                 </div>

//                 <div className={`space-y-1 ${!selectedZone ? 'opacity-40' : ''}`}>
//                   <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Bus ID</label>
//                   <div className="relative flex items-center">
//                     <Bus size={18} className="absolute left-4 text-slate-400" />
//                     <select 
//                       disabled={!selectedZone}
//                       value={identifier} 
//                       onChange={(e) => setIdentifier(e.target.value)}
//                       className="w-full h-12 pl-12 pr-10 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900 appearance-none"
//                     >
//                       <option value="">{selectedZone ? "Choose Bus" : "Select Zone First"}</option>
//                       {filteredBusIds.map(id => <option key={id} value={id}>Bus {id}</option>)}
//                     </select>
//                     <ChevronDown size={16} className="absolute right-4 text-slate-400 pointer-events-none" />
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="space-y-1">
//                 <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Identifier</label>
//                 <div className="relative flex items-center">
//                   <Icon size={18} className="absolute left-4 text-slate-400" />
//                   <input 
//                     type="text"
//                     placeholder={role === "super" ? "master" : "Zone-1"}
//                     value={identifier}
//                     onChange={(e) => setIdentifier(e.target.value)}
//                     className="w-full h-12 pl-12 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900"
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Password</label>
//               <div className="relative flex items-center">
//                 <Lock size={18} className="absolute left-4 text-slate-400" />
//                 <input 
//                   type={showPassword ? "text" : "password"} 
//                   placeholder="••••••••" 
//                   value={password} 
//                   className="w-full h-12 pl-12 pr-12 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900" 
//                   onChange={(e) => setPassword(e.target.value)} 
//                 />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-300">
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             <button disabled={isSubmitting || isLoadingApi} className={`${colorClass} w-full h-14 text-white rounded-3xl font-black text-sm tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2`}>
//               {isSubmitting ? <Loader2 className="animate-spin" /> : <>LOGIN <ArrowRight size={18} /></>}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



// og
// "use client";
// import { useState, useEffect, useMemo } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff, Lock, Loader2, ArrowRight, Bus, MapPin, ShieldCheck, ChevronDown } from "lucide-react";
// import { toast } from "sonner";

// export default function RoleLoginForm({ role, title, colorClass }) {
//   const [apiData, setApiData] = useState([]);
//   const [selectedZone, setSelectedZone] = useState("");
//   // Super admin now defaults to "master" and hides the field
//   const [identifier, setIdentifier] = useState(role === "super" ? "master" : ""); 
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoadingApi, setIsLoadingApi] = useState(role !== "super");
//   const router = useRouter();

//   const Icon = role === "super" ? ShieldCheck : role === "zone" ? MapPin : Bus;

//   // 1. Fetch API data
//   useEffect(() => {
//     if (role === "admin" || role === "zone") {
//       const type = role === "admin" ? "bus" : "zone";
//       fetch(`/api/auth/bus-list?type=${type}`)
//         .then(res => res.json())
//         .then(json => {
//           if (json.success) {
//             setApiData(json.data);
//           }
//           setIsLoadingApi(false);
//         })
//         .catch(() => {
//           toast.error("API Error", { description: `Failed to load ${type} list.` });
//           setIsLoadingApi(false);
//         });
//     }
//   }, [role]);

//   // 2. Fix: Unique String List for Dropdown
//   const zoneList = useMemo(() => {
//     if (!apiData || apiData.length === 0) return [];
    
//     let rawZones = [];
//     if (role === "zone") {
//       rawZones = apiData.map(item => typeof item === 'object' ? item.zone : item);
//     } else {
//       rawZones = apiData.map(item => item.zone);
//     }
    
//     return [...new Set(rawZones)].filter(Boolean).sort();
//   }, [apiData, role]);
  
//   const filteredBusIds = useMemo(() => {
//     if (role !== "admin" || !selectedZone) return [];
//     return apiData
//       .filter(item => item.zone === selectedZone)
//       .map(item => String(item.busId))
//       .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
//   }, [apiData, selectedZone, role]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Maintain the trim logic for the hidden master identifier
//     const finalId = identifier.trim();
    
//     if (!finalId || !password.trim()) {
//       toast.error("Required", { description: "Please complete all fields!" });
//       return;
//     }

//     setIsSubmitting(true);
//     const res = await signIn("credentials", {
//       email: finalId,
//       password: password,
//       redirect: false,
//     });

//     if (res?.ok) {
//       toast.success("Login Successful!");
//       router.push(role === 'super' ? "/dashboard/master" : role === 'zone' ? "/dashboard/zone" : "/dashboard");
//     } else {
//       toast.error("Access Denied", { description: "Incorrect credentials." });
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#F8FAFC] px-6">
//       <div className="w-full max-w-sm space-y-6">
//         <button onClick={() => router.push("/")} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors">
//           <ArrowRight className="rotate-180" size={16} /> Back
//         </button>

//         <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 space-y-6">
//           <div className="text-center space-y-1">
//             <div className={`mx-auto w-12 h-12 ${colorClass.replace('bg-', 'text-')} bg-slate-50 rounded-2xl flex items-center justify-center mb-2`}>
//               {isLoadingApi ? <Loader2 className="animate-spin text-indigo-600" /> : <Icon size={24} />}
//             </div>
//             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
//             {role === "super" && (
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SUPER ADMIN Authorization Required</p>
//             )}
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {(role === "admin" || role === "zone") && (
//               <div className="space-y-1">
//                 <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Select Zone</label>
//                 <div className="relative flex items-center">
//                   <MapPin size={18} className="absolute left-4 text-slate-400" />
//                   <select 
//                     value={role === "zone" ? identifier : selectedZone} 
//                     onChange={(e) => {
//                       if (role === "zone") setIdentifier(e.target.value);
//                       else { setSelectedZone(e.target.value); setIdentifier(""); }
//                     }}
//                     className="w-full h-12 pl-12 pr-10 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900 appearance-none"
//                   >
//                     <option value="">Choose Zone</option>
//                     {zoneList.map((z, idx) => (
//                       <option key={idx} value={String(z)}>
//                         {String(z)}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown size={16} className="absolute right-4 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>
//             )}

//             {role === "admin" && (
//               <div className={`space-y-1 ${!selectedZone ? 'opacity-40' : ''}`}>
//                 <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Select Bus ID</label>
//                 <div className="relative flex items-center">
//                   <Bus size={18} className="absolute left-4 text-slate-400" />
//                   <select 
//                     disabled={!selectedZone}
//                     value={identifier} 
//                     onChange={(e) => setIdentifier(e.target.value)}
//                     className="w-full h-12 pl-12 pr-10 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900 appearance-none"
//                   >
//                     <option value="">{selectedZone ? "Choose Bus" : "Select Zone First"}</option>
//                     {filteredBusIds.map(id => <option key={id} value={id}>Bus {id}</option>)}
//                   </select>
//                   <ChevronDown size={16} className="absolute right-4 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>
//             )}

//             {/* Identifier input is now hidden for Super Admin, only showing for others if needed */}
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Password</label>
//               <div className="relative flex items-center">
//                 <Lock size={18} className="absolute left-4 text-slate-400" />
//                 <input 
//                   type={showPassword ? "text" : "password"} 
//                   placeholder="••••••••" 
//                   value={password} 
//                   className="w-full h-12 pl-12 pr-12 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900" 
//                   onChange={(e) => setPassword(e.target.value)} 
//                 />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-300">
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             <button disabled={isSubmitting || isLoadingApi} className={`${colorClass} w-full h-14 text-white rounded-3xl font-black text-sm tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2`}>
//               {isSubmitting ? <Loader2 className="animate-spin" /> : <>LOGIN <ArrowRight size={18} /></>}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";
import { useState, useMemo } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Loader2, ArrowRight, Bus, MapPin, ShieldCheck, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export default function RoleLoginForm({ role, title, colorClass, initialData = [] }) {
  const [apiData] = useState(initialData); 
  const [selectedZone, setSelectedZone] = useState("");
  const [identifier, setIdentifier] = useState(role === "super" ? "master" : ""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const Icon = role === "super" ? ShieldCheck : role === "zone" ? MapPin : Bus;

  const zoneList = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];
    let rawZones = role === "zone" 
      ? apiData.map(item => typeof item === 'object' ? item.zone : item)
      : apiData.map(item => item.zone);
    return [...new Set(rawZones)].filter(Boolean).sort();
  }, [apiData, role]);
  
  const filteredBusIds = useMemo(() => {
    if (role !== "admin" || !selectedZone) return [];
    return apiData
      .filter(item => item.zone === selectedZone)
      .map(item => String(item.busId))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [apiData, selectedZone, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalId = identifier.trim();
    if (!finalId || !password.trim()) {
      toast.error("Required", { description: "Complete all fields!" });
      return;
    }

    setIsSubmitting(true);
    const res = await signIn("credentials", {
      email: finalId,
      password: password,
      redirect: false,
    });

    if (res?.ok) {
      toast.success("Login Successful!");
      router.push(role === 'super' ? "/dashboard/master" : role === 'zone' ? "/dashboard/zone" : "/dashboard");
    } else {
      toast.error("Access Denied", { description: "Incorrect credentials." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#F8FAFC] px-6">
      <div className="w-full max-w-sm space-y-6">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors">
          <ArrowRight className="rotate-180" size={16} /> Back
        </button>

        <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 space-y-6">
          <div className="text-center space-y-1">
            <div className={`mx-auto w-12 h-12 ${colorClass.replace('bg-', 'text-')} bg-slate-50 rounded-2xl flex items-center justify-center mb-2`}>
              <Icon size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {(role === "admin" || role === "zone") && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Select Zone</label>
                <div className="relative flex items-center">
                  <MapPin size={18} className="absolute left-4 text-slate-400" />
                  <select 
                    value={role === "zone" ? identifier : selectedZone} 
                    onChange={(e) => {
                      if (role === "zone") setIdentifier(e.target.value);
                      else { setSelectedZone(e.target.value); setIdentifier(""); }
                    }}
                    className="w-full h-12 pl-12 pr-10 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900 appearance-none"
                  >
                    <option value="">Choose Zone</option>
                    {zoneList.map((z, idx) => <option key={idx} value={String(z)}>{String(z)}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            )}

            {role === "admin" && (
              <div className={`space-y-1 ${!selectedZone ? 'opacity-40' : ''}`}>
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Select Bus ID</label>
                <div className="relative flex items-center">
                  <Bus size={18} className="absolute left-4 text-slate-400" />
                  <select 
                    disabled={!selectedZone}
                    value={identifier} 
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full h-12 pl-12 pr-10 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900 appearance-none"
                  >
                    <option value="">{selectedZone ? "Choose Bus" : "Select Zone First"}</option>
                    {filteredBusIds.map(id => <option key={id} value={id}>Bus {id}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Password</label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-4 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password} 
                  className="w-full h-12 pl-12 pr-12 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-slate-900" 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button disabled={isSubmitting} className={`${colorClass} w-full h-14 text-white rounded-3xl font-black text-sm tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2`}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <>LOGIN <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}