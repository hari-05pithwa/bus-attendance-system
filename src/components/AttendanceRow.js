// "use client";
// import { User } from "lucide-react";
// import Toggle from "./ui/Toggle";

// export default function AttendanceRow({ person, onToggle, searchQuery, highlightComponent: Highlight }) {
//   return (
//     <div className="flex items-center justify-between bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm active:scale-[0.98] transition-all mb-4">
//       <div className="flex items-center gap-4">
//         <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${person.isPresent ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'}`}>
//           <User size={20} />
//         </div>
        
//         <div className="flex flex-col">
//           <h3 className={`font-bold text-sm tracking-tight leading-tight transition-all ${!person.isPresent ? 'text-slate-300 line-through' : 'text-slate-900'}`}>
//             <Highlight text={person.name} query={searchQuery} />
//           </h3>
//           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
//             {person.role}
//           </p>
//         </div>
//       </div>

//       <Toggle 
//         enabled={person.isPresent} 
//         onChange={() => onToggle([person.id], person.isPresent)} 
//       />
//     </div>
//   );
// }





//ai
// "use client";
// import { UserCircle2, CheckCircle2, Circle } from "lucide-react";

// export default function AttendanceRow({ person, onToggle, searchQuery, highlightComponent: Highlight, activeSlot }) {
//   // Check the status for ONLY the slot selected in the top tabs
//   const isMarked = person.attendence?.[activeSlot] || false;
//   const uniqueKey = person.id || person.phone;

//   return (
//     <div className="bg-white p-5 rounded-[30px] border border-slate-100 shadow-sm mb-4 transition-all active:scale-[0.98]">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           {/* Avatar with dynamic color based on marking */}
//           <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${isMarked ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-300'}`}>
//             <UserCircle2 size={28} />
//           </div>
          
//           <div className="flex flex-col">
//             <h3 className={`font-bold text-base tracking-tight leading-tight transition-all ${isMarked ? 'text-slate-900' : 'text-slate-400'}`}>
//               <Highlight text={person.name} query={searchQuery} />
//             </h3>
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
//               {person.role} {person.mandal ? `• ${person.mandal}` : ''}
//             </p>
//           </div>
//         </div>

//         {/* Big Action Toggle */}
//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             onToggle(uniqueKey, activeSlot, isMarked);
//           }}
//           className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-sm border-2 ${
//             isMarked 
//             ? 'bg-emerald-500 border-emerald-500 text-white' 
//             : 'bg-white border-slate-100 text-slate-200'
//           }`}
//         >
//           {isMarked ? <CheckCircle2 size={24} strokeWidth={3} /> : <Circle size={24} strokeWidth={3} />}
//         </button>
//       </div>
//     </div>
//   );
// }












//ai2
// "use client";
// import { UserCircle2, CheckCircle2, Circle } from "lucide-react";

// export default function AttendanceRow({ person, onToggle, searchQuery, highlightComponent: Highlight, activeSlot }) {
//   const isMarked = person.attendence?.[activeSlot] || false;
//   const isFemale = person.gender?.toLowerCase() === 'female'; // Checks for female gender
//   const uniqueKey = person.id || person.phone;

//   // Determine the color theme based on gender + marked status
//   const getThemeClasses = () => {
//     if (!isMarked) return 'bg-slate-50 text-slate-300 border-slate-100';
//     return isFemale 
//       ? 'bg-rose-500 text-white shadow-rose-200' // Pink theme
//       : 'bg-emerald-500 text-white shadow-emerald-200'; // Green theme
//   };

//   return (
//     <button
//       onClick={(e) => {
//         e.preventDefault();
//         onToggle(uniqueKey, activeSlot, isMarked);
//       }}
//       className={`w-full text-left bg-white p-4 rounded-[26px] border mb-3 transition-all active:scale-[0.97] flex items-center justify-between group ${
//         isMarked 
//           ? (isFemale ? 'border-rose-100 shadow-sm' : 'border-emerald-100 shadow-sm')
//           : 'border-slate-100 shadow-sm'
//       }`}
//     >
//       <div className="flex items-center gap-4">
//         {/* Avatar Area */}
//         <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
//           isMarked 
//             ? `${isFemale ? 'bg-pink-500' : 'bg-emerald-500'} text-white rotate-[360deg]` 
//             : 'bg-slate-50 text-slate-300'
//         }`}>
//           <UserCircle2 size={26} strokeWidth={isMarked ? 2.5 : 2} />
//         </div>
        
//         <div className="flex flex-col gap-1">
//           <h3 className={`font-bold text-[15px] tracking-tight leading-none transition-all ${isMarked ? 'text-slate-900' : 'text-slate-400'}`}>
//             <Highlight text={person.name} query={searchQuery} />
//           </h3>
          
//           <div className="flex items-center gap-2">
//             {/* Small Role Badge */}
//             <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-widest border transition-colors ${
//                isMarked 
//                 ? (isFemale ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600')
//                 : 'bg-slate-50 border-slate-100 text-slate-400'
//             }`}>
//               {person.role}
//             </span>
//             {person.mandal && (
//               <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter italic">
//                 {person.mandal}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Visual Indicator */}
//       <div
//         className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
//           isMarked 
//           ? `${isFemale ? 'bg-pink-500 shadow-rose-200' : 'bg-emerald-500 shadow-emerald-200'} shadow-lg text-white` 
//           : 'bg-slate-50 text-slate-200 border border-slate-100 group-active:bg-slate-100'
//         }`}
//       >
//         {isMarked ? <CheckCircle2 size={20} strokeWidth={3} /> : <Circle size={20} strokeWidth={2} />}
//       </div>
//     </button>
//   );
// }





//final
"use client";
import { UserCircle2, CheckCircle2, Circle, AlertCircle } from "lucide-react";

export default function AttendanceRow({ person, onToggle, searchQuery, highlightComponent: Highlight, activeSlot }) {
  const isMarked = person.attendence?.[activeSlot] || false;
  const isFemale = person.gender?.toLowerCase() === 'female';
  const uniqueKey = person.id || person.phone;

  // DEPENDENCY CHECK: Is this member absent for the return boarding?
  const missedReturnBoarding = activeSlot === "At_4" && !person.attendence?.At_3;

  return (
    <button
      disabled={missedReturnBoarding} // Prevent clicking A4 if A3 is false
      onClick={(e) => {
        e.preventDefault();
        onToggle(uniqueKey, activeSlot, isMarked);
      }}
      className={`w-full text-left bg-white p-4 rounded-[26px] border mb-3 transition-all active:scale-[0.97] flex items-center justify-between group ${
        missedReturnBoarding ? 'opacity-40 grayscale pointer-events-none' : ''
      } ${
        isMarked 
          ? (isFemale ? 'border-rose-100 shadow-sm' : 'border-emerald-100 shadow-sm')
          : 'border-slate-100 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
          isMarked 
            ? `${isFemale ? 'bg-pink-500' : 'bg-emerald-500'} text-white rotate-[360deg]` 
            : 'bg-slate-50 text-slate-300'
        }`}>
          <UserCircle2 size={26} strokeWidth={isMarked ? 2.5 : 2} />
        </div>
        
        <div className="flex flex-col gap-1">
          <h3 className={`font-bold text-[15px] tracking-tight leading-none transition-all ${isMarked ? 'text-slate-900' : 'text-slate-400'}`}>
            <Highlight text={person.name} query={searchQuery} />
          </h3>
          
          <div className="flex items-center gap-2">
            <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-widest border transition-colors ${
               isMarked 
                ? (isFemale ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600')
                : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}>
              {person.role}
            </span>
            {missedReturnBoarding && (
              <span className="flex items-center gap-1 text-[7px] font-black text-rose-500 uppercase">
                <AlertCircle size={8} /> Absent in A3
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
          isMarked 
          ? `${isFemale ? 'bg-pink-500 shadow-rose-200' : 'bg-emerald-500 shadow-emerald-200'} shadow-lg text-white` 
          : 'bg-slate-50 text-slate-200 border border-slate-100 group-active:bg-slate-100'
        }`}
      >
        {isMarked ? <CheckCircle2 size={20} strokeWidth={3} /> : <Circle size={20} strokeWidth={2} />}
      </div>
    </button>
  );
}