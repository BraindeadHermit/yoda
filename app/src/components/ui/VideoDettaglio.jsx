import React from "react";
import { Play } from "lucide-react";

export default function VideoDettaglio({ title, author, role, initials }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <p className="text-gray-600">Published by {author} ({role})</p>
      </div>

      <div className="relative aspect-video bg-gray-100">
        <button className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full border-2 border-[#22C55E] p-4">
            <Play className="h-8 w-8 text-[#22C55E]" />
          </div>
        </button>
      </div>

      <div className="p-4 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
          {initials}
        </div>
        <span className="font-medium">{author}</span>
      </div>
    </div>
  );
}
