"use client";

export default function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`
        relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none
        ${enabled ? "bg-green-500" : "bg-slate-300"}
      `}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out
          ${enabled ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}