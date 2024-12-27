import React from "react";
import StaticThumbnail from "./V.png"; // Importa l'immagine statica

export default function VideoCard({ title, author, role }) {
  return (
    <div className="group rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow bg-green-500">
      <div className="relative aspect-video bg-white w-3/4 h-40 absolute left-1/2 transform -translate-x-1/2 top-5">
        {/* Usa sempre l'immagine statica */}
        <img
          src={StaticThumbnail} // Mostra sempre l'immagine statica
          alt={title || "Immagine statica"} // Alt-text per l'accessibilità
          className="object-cover w-full h-full absolute top-0 left-0"
        />
      </div>
      <div className="p-4 mt-4">
        <h3 className="font-medium text-white mb-2 text-xl">{title}</h3> {/* Titolo rimpicciolito */}
        <div className="flex items-center text-sm text-white">
          <span className="text-base">{author}</span> {/* Autore leggermente più grande */}
          <span className="mx-2">•</span>
          <span className="text-base">{role}</span> {/* Ruolo leggermente più grande */}
        </div>
      </div>
    </div>
  );
}
