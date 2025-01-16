import React from "react";
import StaticThumbnail from "./V.png"; // Importa l'immagine statica

export default function VideoCard({ title, author, role }) {
  return (
    <div className="group rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="relative aspect-video bg-white w-2/3 h-36 absolute left-1/2 transform -translate-x-1/2 top-5">
        {/* Usa sempre l'immagine statica */}
        <img
          src={StaticThumbnail} // Mostra sempre l'immagine statica
          alt={title || "Immagine statica"} // Alt-text per l'accessibilità
          className="object-cover w-[95%] h-[95%] absolute top-0 left-0 transform translate-x-[2.5%] translate-y-[2.5%]"
        />
      </div>
      <div className="p-4 mt-2"> {/* Margine superiore ancora più ridotto */}
        <h3 className="font-medium text-green-500 mb-2 text-xl">{title}</h3> {/* Testo verde */}
      </div>
    </div>
  );
}
