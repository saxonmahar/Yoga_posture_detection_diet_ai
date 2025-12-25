import React from "react";

export default function MacroCard({ title, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-white/10 text-center">
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
